import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import json from '@rollup/plugin-json';
import bundleSize from 'rollup-plugin-bundle-size';

// https://github.com/egoist/rollup-plugin-esbuild/issues/361
import _esbuild from 'rollup-plugin-esbuild';
const esbuild = _esbuild.default ?? _esbuild;

// ============================================================================
// Arguments
// ============================================================================

// Parse command line arguments using yargs
const argv = yargs(hideBin(process.argv))
  .options({
    prod: {
      type: 'boolean',
      default: false,
      description: 'Build in production mode',
    },
    preview: {
      type: 'boolean',
      default: false,
      description: 'Run in preview mode',
    },
  })
  .parseSync();

const { prod: isProduction, preview: isPreview } = argv;

// ============================================================================
// Shared
// ============================================================================

const sharedPlugins = {
  // Resolve and bundle dependencies from node_modules
  nodeResolve: nodeResolve({
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    browser: true,
  }),
  // Resolve and bundle .json files
  json: json(),
  // Convert CommonJS modules (from node_modules) into ES modules targeted by this app
  commonjs: commonjs(),
  // Transpile TypeScript code to JavaScript (ES6), and minify in production
  esbuild: esbuild({
    tsconfig: './tsconfig.json',
    minify: isProduction,
    target: 'es6',
    exclude: [/node_modules/],
    loaders: {
      '.json': 'json',
    },
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    sourceMap: false, // Configured in rollup 'output' object
  }),
  // Replace process.env.NODE_ENV with 'production' or 'development'
  replace: replace({
    preventAssignment: true,
    'process.env.npm_package_version': JSON.stringify(
      require('./package.json').version
    ),
    'process.env.NODE_ENV': JSON.stringify(
      isProduction ? 'production' : 'development'
    ),
    'process.env.PREVIEW_MODE': isPreview,
  }),
  bundleSize: bundleSize(),
};

// ============================================================================
// Config
// ============================================================================

/** @type {import('rollup').RollupOptions[]} */
export default [
  // Configuration for background code
  {
    input: './src/background/index.ts',
    output: {
      file: './dist/code.js',
      format: 'es',
      sourcemap: !isProduction,
    },
    plugins: [
      sharedPlugins.nodeResolve,
      sharedPlugins.json,
      sharedPlugins.commonjs,
      sharedPlugins.esbuild,
      sharedPlugins.replace,
      // Parse environment variables
      replace({
        preventAssignment: true,
        ...parseDotenv('./.env.background'),
      }),
      sharedPlugins.bundleSize,
    ],
    external: ['react', 'react-dom'],
  },
  // Configuration for UI code
  {
    input: isPreview ? './src/preview-ui/index.tsx' : './src/ui/index.tsx',
    output: {
      file: './dist/ui.js',
      format: 'es',
      sourcemap: !isProduction,
      inlineDynamicImports: true,
    },
    plugins: [
      sharedPlugins.nodeResolve,
      sharedPlugins.json,
      sharedPlugins.commonjs,
      sharedPlugins.esbuild,
      sharedPlugins.replace,
      // Parse environment variables
      replace({
        preventAssignment: true,
        ...parseDotenv('./.env.ui'),
      }),
      // Generate HTML file with injected bundle
      html({
        fileName: `ui.html`,
        template(options) {
          return `
<!doctype html>
<html lang="en" data-theme="lofi">
  <head>
    <meta charset="utf-8">
    <title>Your Name</title>
  </head>
  <body>
    <script>${options?.bundle[`ui.js`]['code']}</script>
    <div id="root" />
  </body>
</html>
        `;
        },
      }),
      // Process and bundle CSS files
      postcss({
        config: {
          path: './postcss.config.js',
          ctx: {},
        },
        minimize: isProduction,
        sourceMap: !isProduction,
      }),
      // Copy static files to output folder
      copy({
        targets: [
          {
            src: 'manifest.json',
            dest: 'dist',
          },
        ],
      }),
      sharedPlugins.bundleSize,
    ],
  },
];

// ============================================================================
// Helper
// ============================================================================

// Reads and parses the dotenv file using the 'dotenv' package
function parseDotenv(relativeFilePath) {
  const data = fs.readFileSync(path.resolve(process.cwd(), relativeFilePath));
  const parsed = dotenv.parse(data);

  // Wrap values with quotes to handle strings containing special characters (required for replace plugin)
  const env = {};
  for (const key in parsed) {
    env[`process.env.${key}`] = JSON.stringify(parsed[key]);
  }

  return env;
}
