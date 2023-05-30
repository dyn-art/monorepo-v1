import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';
import { InputPluginOption, RollupOptions, defineConfig } from 'rollup';
import bundleSize from 'rollup-plugin-bundle-size';
import esbuild from 'rollup-plugin-esbuild';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
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
    additionalOptions?: RollupOptions;
    additionalPlugins?: InputPluginOption[];
    isProduction?: boolean;
  } = {}
) {
  const {
    input = './src/index.ts',
    output = getDefaultOutputPath(),
    tsconfig = path.resolve('./tsconfig.json'),
    isProduction = false,
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
        additionalOptions,
        additionalPlugins,
      },
    ],
  });

  return defineConfig({
    input,
    output: {
      file: output,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      // Exclude peer dependencies from bundle
      peerDepsExternal(),
      // Resolve and bundle dependencies from node_modules
      nodeResolve({
        preferBuiltins: true,
      }),
      // Resolve and bundle .json files
      json(),
      // Convert CommonJS modules from node_modules into ES modules targeted by this app
      commonjs({
        include: ['node_modules/**'],
      }),
      // Transpile TypeScript code to JavaScript (ES6), and minify in production
      esbuild({
        tsconfig,
        minify: isProduction,
        target: 'es6',
        exclude: [/node_modules/],
        loaders: {
          '.json': 'json',
        },
      }),
      // typescript(/* */), // Obsolete as esbuild takes care of configuring typescript
      // babel(/* */), // Obsolete as esbuild takes care of converting ES2015+ modules into compatible JavaScript files
      // terser(/* */), // Obsolete as esbuild takes care of minifying
      // Show size of generated bundle
      bundleSize(),
      ...additionalPlugins,
    ],
    ...additionalOptions,
  });
}

function getDefaultOutputPath() {
  const packageJsonPath = path.resolve('./package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.main || 'dist/index.js';
}
