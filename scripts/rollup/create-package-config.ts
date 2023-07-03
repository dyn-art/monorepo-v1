import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';
import {
  InputPluginOption,
  OutputOptions,
  Plugin,
  RollupOptions,
  defineConfig,
} from 'rollup';
import bundleSize from 'rollup-plugin-bundle-size';
import esbuild from 'rollup-plugin-esbuild';
import nodeExternals from 'rollup-plugin-node-externals';
import visualizer from 'rollup-plugin-visualizer';
import { Logger } from '../utils';

const logger = new Logger('create-package-config');

export function createPackageConfig(options: TCreatePackageOptions = {}) {
  // Resolve package.json
  const packageJsonPath = path.resolve(process.cwd(), './package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const {
    format = 'esm',
    inputPath = path.resolve(
      process.cwd(),
      'source' in packageJson ? packageJson.source : './src/index.ts'
    ),
    tsconfig = path.resolve(process.cwd(), './tsconfig.json'),
    rollupOptions = {},
    isProduction,
    preserveModules = true,
    sourcemap = true,
    analyze = false,
  } = options;

  // Specific module format configuration
  const configureProps = {
    outputPath: options.outputPath,
    output: {
      name: packageJson.name,
      preserveModules,
      sourcemap,
    },
    packageJson,
    preserveModules,
  };
  const { output, visualizeFilePath } =
    format === 'esm'
      ? configureESM(configureProps)
      : configureCJS(configureProps);

  // Log path to visualization
  if (analyze) {
    logger.info(`Visualized at: ${visualizeFilePath}`);
  }

  // Extract properties from custom rollup options to merge them into the final options
  const {
    output: rollupOptionsOutput = {},
    plugins: rollupOptionsPlugins = [],
    ...rollupOptionsRest
  } = rollupOptions;

  return defineConfig({
    input: inputPath,
    output: { ...output, ...rollupOptionsOutput },
    plugins: arrangePlugins(
      [
        // Automatically declares NodeJS built-in modules like (node:path, node:fs) as external.
        // This prevents Rollup from trying to bundle these built-in modules,
        // which can cause unresolved dependencies warnings.
        nodeExternals(),
        // Resolve and bundle dependencies from node_modules
        nodeResolve({
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        }),
        // Resolve and bundle .json files
        json(),
        // Convert CommonJS modules (from node_modules) into ES modules targeted by this app
        commonjs(),
        // Transpile TypeScript code to JavaScript (ES6), and minify in production
        esbuild({
          tsconfig,
          minify: isProduction,
          target: 'es6',
          exclude: [/node_modules/],
          loaders: {
            '.json': 'json',
          },
          sourceMap: false, // Configured in rollup 'output' object
        }),
        // typescript(/* */), // Obsolete as esbuild takes care of configuring typescript
        // babel(/* */), // Obsolete as esbuild takes care of converting ES2015+ modules into compatible JavaScript files
        // terser(/* */), // Obsolete as esbuild takes care of minifying
        !preserveModules && bundleSize(),
        ...(analyze && visualizeFilePath != null
          ? [
              visualizer({
                title: packageJson.name,
                filename: visualizeFilePath,
                sourcemap: true,
                gzipSize: true,
              }),
              visualizer({
                title: packageJson.name,
                filename: visualizeFilePath,
                sourcemap: true,
                gzipSize: true,
                template: 'raw-data',
              }),
            ]
          : []),
      ],
      rollupOptionsPlugins
    ),
    // Exclude peer dependencies and dependencies from bundle for these reasons:
    // 1. To prevent duplication: If every package included a copy of all its dependencies,
    //    there would be a lot of duplication in node_modules.
    // 2. To enable better versioning: This way, npm can handle installing the latest compatible version.
    // 3. For improved security: If a security vulnerability is found in a dependency,
    //    npm can update it without needing to update this package.
    // 4. Auto Installation: Package managers automatically install these dependencies, so no need to bundle them.
    external: [
      ...Object.keys({
        ...(packageJson.dependencies || {}),
        ...(packageJson.peerDependencies || {}),
      }),
    ],
    ...rollupOptionsRest,
  });
}

/*
 * Defines specific Rollup configuration properties for building ES module (ESM) bundles,
 * which are designed to be consumed by modern browsers or Node.js environments that support ESM.
 * ESM is the official standard format to package JavaScript modules,
 * and it's supported in modern browsers and Node.js (version 14 onwards with the --experimental-modules flag, and without flag from version 15).
 * The created bundles are tree-shakeable, meaning unused exports can be removed by build tools to reduce bundle size.
 */
function configureESM(props: TConfigureModuleProps): TConfigureModuleResponse {
  const outputPath =
    props.outputPath ??
    getDefaultOutputPath(props.packageJson, {
      defaultPath: './dist/esm/index.js',
      dir: props.preserveModules,
      packageJsonProperty: 'module',
    });
  return {
    output: {
      ...props.output,
      ...{
        [props.preserveModules ? 'dir' : 'file']: path.resolve(
          process.cwd(),
          outputPath
        ),
        format: 'esm',
      },
    },
    visualizeFilePath: path.resolve(process.cwd(), './.compile/stats-esm.html'),
  };
}

/*
 * Defines specific Rollup configuration properties for building CommonJS bundles,
 * which are primarily designed to be consumed by Node.js environments
 * that do not yet support ES modules, or for compatibility with older bundling tools.
 * CommonJS is the module system that Node.js has used historically.
 * It's widely supported and is appropriate for building applications
 * or libraries that target Node.js or need to support older environments.
 * Note: Tree-shaking is generally not supported in CommonJS modules.
 */
function configureCJS(props: TConfigureModuleProps): TConfigureModuleResponse {
  const outputPath =
    props.outputPath ??
    getDefaultOutputPath(props.packageJson, {
      defaultPath: './dist/cjs/index.js',
      dir: props.preserveModules,
      packageJsonProperty: 'main',
    });
  return {
    output: {
      ...props.output,
      ...{
        [props.preserveModules ? 'dir' : 'file']: path.resolve(
          process.cwd(),
          outputPath
        ),
        format: 'cjs',
        exports: 'named',
      },
    },
    visualizeFilePath: path.resolve(process.cwd(), './.compile/stats-cjs.html'),
  };
}

function arrangePlugins(
  basePlugins: InputPluginOption[],
  customPlugins: (TCustomPlugin | RollupOptions['plugins'])[]
): Plugin[] {
  const arrangedPlugins: { key: string; plugin: Plugin }[] = basePlugins
    .map((plugin) => (isPlugin(plugin) ? { plugin, key: plugin.name } : null))
    .filter(notEmpty);

  for (let customPlugin of customPlugins) {
    // Check whether its a custom plugin with 'before' & 'after' syntax.
    // If not add it to the end.
    if (!isCustomPlugin(customPlugin)) {
      if (isPlugin(customPlugin)) {
        arrangedPlugins.push({ plugin: customPlugin, key: customPlugin.name });
      }
      continue;
    }

    // Check whether the custom plugin should be inserted before a base plugin
    if (customPlugin.before) {
      const beforeIndex = arrangedPlugins.findIndex(
        (plugin) => plugin.key === (customPlugin as TCustomPlugin).before
      );
      if (beforeIndex !== -1) {
        arrangedPlugins.splice(beforeIndex, 0, {
          key: customPlugin.before,
          plugin: customPlugin.plugin,
        });
      }
    }
    // Check whether the custom plugin should be inserted after a base plugin
    else if (customPlugin.after) {
      const afterIndex = arrangedPlugins.findIndex(
        (plugin) => plugin.key === (customPlugin as TCustomPlugin).after
      );
      if (afterIndex !== -1) {
        arrangedPlugins.splice(afterIndex + 1, 0, {
          key: customPlugin.after,
          plugin: customPlugin.plugin,
        });
      }
    }
    // If the custom plugin does not specify a position, add it to the end
    else {
      arrangedPlugins.push({
        key: customPlugin.plugin.name,
        plugin: customPlugin.plugin,
      });
    }
  }

  return arrangedPlugins.map((plugin) => plugin.plugin);
}

function getDefaultOutputPath(
  packageJson: any,
  options: TGetDefaultOutputPathOptions
) {
  const rawModule =
    packageJson[options.packageJsonProperty] ?? options.defaultPath;
  const module = options.dir
    ? rawModule.replace(/\/[^\/]*\.js$/, '') // remove '/index.js' if bundling to dir
    : rawModule;
  return module;
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

function isPlugin(value: any): value is Plugin {
  return typeof value.name === 'string';
}

function isCustomPlugin(value: any): value is TCustomPlugin {
  return typeof value.plugin === 'object' && isPlugin(value.plugin);
}

type TCustomPlugin = {
  plugin: Plugin;
  before?: string;
  after?: string;
};

export type TCreatePackageOptions = {
  format?: 'esm' | 'cjs';
  inputPath?: string;
  outputPath?: string;
  tsconfig?: string;
  isProduction?: boolean;
  preserveModules?: boolean;
  sourcemap?: boolean;
  analyze?: boolean;
  rollupOptions?: Omit<RollupOptions, 'plugins'> & {
    plugins?: (TCustomPlugin | RollupOptions['plugins'])[];
  };
};

type TGetDefaultOutputPathOptions = {
  packageJsonProperty: string;
  defaultPath: string;
  dir: boolean;
};

type TConfigureModuleProps = {
  outputPath?: string;
  packageJson: any;
  preserveModules: any;
  output: OutputOptions;
};

type TConfigureModuleResponse = {
  output: OutputOptions;
  visualizeFilePath: string;
};
