import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';
import { InputPluginOption, RollupOptions, defineConfig } from 'rollup';
import bundleSize from 'rollup-plugin-bundle-size';
import esbuild from 'rollup-plugin-esbuild';
import nodeExternals from 'rollup-plugin-node-externals';
import visualizer from 'rollup-plugin-visualizer';
import { Logger } from '../utils';

const logger = new Logger('create-common-js-config');

/*
 * Rollup configuration for building CommonJS bundles,
 * which are primarily designed to be consumed by Node.js environments
 * that do not yet support ES modules, or for compatibility with older bundling tools.
 * CommonJS is the module system that Node.js has used historically.
 * It's widely supported and is appropriate for building applications
 * or libraries that target Node.js or need to support older environments.
 * Note: Tree-shaking is generally not supported in CommonJS modules.
 */
export function createCommonJSConfig(
  options: {
    input?: string;
    output?: string;
    tsconfig?: string;
    isProduction?: boolean;
    preserveModules?: boolean;
    sourcemap?: boolean;
    analyze?: boolean;
    additionalOptions?: RollupOptions;
    additionalPlugins?: InputPluginOption[];
  } = {}
) {
  const packageJsonPath = path.resolve('./package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const {
    input = path.resolve('./src/index.ts'),
    output = getDefaultOutputPath(packageJson, options.preserveModules),
    tsconfig = path.resolve('./tsconfig.json'),
    isProduction = false,
    preserveModules = true,
    sourcemap = true,
    analyze = false,
    additionalOptions = {},
    additionalPlugins = [],
  } = options;

  logger.info('Defined configuration: ', {
    args: [
      {
        input,
        output,
        tsconfig,
        isProduction,
        preserveModules,
        additionalOptions,
        additionalPlugins,
      },
    ],
  });

  const visualizeFilePath = path.resolve('.compile/stats-cjs.html');
  if (analyze) {
    logger.info(`Visualized at: ${visualizeFilePath}`);
  }

  return defineConfig({
    input,
    output: {
      name: packageJson.name,
      [preserveModules ? 'dir' : 'file']: path.resolve(output),
      format: 'cjs',
      preserveModules,
      sourcemap,
      exports: 'named',
    },
    plugins: [
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
        sourceMap: false,
      }),
      // typescript(/* */), // Obsolete as esbuild takes care of configuring typescript
      // babel(/* */), // Obsolete as esbuild takes care of converting ES2015+ modules into compatible JavaScript files
      // terser(/* */), // Obsolete as esbuild takes care of minifying
      // Show size of generated bundle
      !preserveModules && bundleSize(),
      analyze &&
        visualizer({
          title: packageJson.name,
          filename: visualizeFilePath,
          sourcemap: true,
          gzipSize: true,
        }),
      ...additionalPlugins,
    ],
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
    ...additionalOptions,
  });
}

function getDefaultOutputPath(packageJson: any, dir = true) {
  const rawModule = packageJson.main ?? './dist/cjs/index.js';
  const module = dir
    ? rawModule.replace(/\/[^\/]*\.js$/, '') // remove '/index.js' if bundling to dir
    : rawModule;
  return module;
}
