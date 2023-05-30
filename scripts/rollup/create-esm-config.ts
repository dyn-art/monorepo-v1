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

const logger = new Logger('create-esm-config');

/*
 * Rollup configuration for building ES module (ESM) bundles,
 * which are designed to be consumed by modern browsers or Node.js environments that support ESM.
 * ESM is the official standard format to package JavaScript modules,
 * and it's supported in modern browsers and Node.js (version 14 onwards with the --experimental-modules flag, and without flag from version 15).
 * The created bundles are tree-shakeable, meaning unused exports can be removed by build tools to reduce bundle size.
 */
export function createESMConfig(
  options: {
    input?: string;
    output?: string;
    tsconfig?: string;
    multiFileOutput?: boolean;
    isProduction?: boolean;
    additionalOptions?: RollupOptions;
    additionalPlugins?: InputPluginOption[];
  } = {}
) {
  const {
    input = './src/index.ts',
    output = getDefaultOutputPath(options.multiFileOutput),
    tsconfig = path.resolve('./tsconfig.json'),
    isProduction,
    multiFileOutput = true,
    additionalOptions = {},
    additionalPlugins = [],
  } = options;

  logger.info('Defined configuration', {
    args: [
      {
        input,
        output,
        tsconfig,
        isProduction,
        multiFileOutput,
        additionalOptions,
        additionalPlugins,
      },
    ],
  });

  return defineConfig({
    input,
    output: {
      [multiFileOutput ? 'dir' : 'file']: output,
      format: 'esm',
      preserveModules: multiFileOutput, // https://stackoverflow.com/questions/55339256/tree-shaking-with-rollup
    },
    plugins: [
      // Exclude peer dependencies from bundle
      peerDepsExternal(),
      // Resolve and bundle dependencies from node_modules
      nodeResolve({
        preferBuiltins: false,
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
      !multiFileOutput && bundleSize(),
      ...additionalPlugins,
    ],
    ...additionalOptions,
  });
}

function getDefaultOutputPath(dir = true) {
  const packageJsonPath = path.resolve('./package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const rawModule = packageJson.module ?? './dist/esm/index.js';
  const module = dir
    ? rawModule.replace(/\/[^\/]*$/, '') // remove '/index.js' if bundling to dir
    : rawModule;
  return module;
}
