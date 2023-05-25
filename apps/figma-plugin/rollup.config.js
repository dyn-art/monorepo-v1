import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';

// Parse command line arguments using yargs
const argv = yargs(hideBin(process.argv)).options({
  prod: {
    type: 'boolean',
    default: false,
    description: 'Build in production mode',
  },
}).argv;

const isProduction = argv.prod;

// Reads and parses the dotenv file using the 'dotenv' package
function parseDotenv(filePath) {
  const data = fs.readFileSync(filePath);
  const parsed = dotenv.parse(data);

  // Wrap values with quotes to handle strings containing special characters (required for replace plugin)
  const env = {};
  for (const key in parsed) {
    env[`process.env.${key}`] = JSON.stringify(parsed[key]);
  }

  return env;
}

const sharedPlugins = {
  start: [
    // Resolve and bundle dependencies from node_modules
    nodeResolve({
      preferBuiltins: true,
      browser: true,
    }),
    // Transpile the code to an earlier ECMAScript version (ES6)
    // to ensure compatibility with environments that do not support
    // some modern JavaScript syntax (e.g. Array.includes(), Object.values()).
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              // Target browsers that support ES Modules which is targeted by this app
              // Reference: https://babeljs.io/docs/en/babel-preset-env
              esmodules: true,
            },
          },
        ],
      ],
    }),
    // Convert CommonJS modules (e.g. from 'node_modules' packages) to ES modules targeted by this app
    commonjs(),
    // TypeScript compilation
    typescript({
      tsconfig: path.resolve('./tsconfig.json'),
      exclude: /node_modules/,
    }),
    // Resolve JSON
    json(),
    // Replace process.env.NODE_ENV with 'production' or 'development'
    replace({
      preventAssignment: true,
      'process.env.npm_package_version': JSON.stringify(
        require('./package.json').version
      ),
      'process.env.NODE_ENV': JSON.stringify(
        isProduction ? 'production' : 'development'
      ),
    }),
  ],
  end: [
    // Minify JavaScript in production
    isProduction && terser(),
  ],
};

/** @type {import('rollup').RollupOptions} */
export default [
  // Configuration for background code
  {
    input: path.resolve('./src/background/index.ts'),
    output: {
      file: 'dist/code.js',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      ...sharedPlugins.start,
      // Parse environment variables
      replace({
        preventAssignment: true,
        ...parseDotenv(path.resolve('./.env.background')),
      }),
      ...sharedPlugins.end,
    ],
    external: ['react', 'react-dom'],
  },
  // Configuration for UI code
  {
    input: path.resolve('./src/ui/index.tsx'),
    output: {
      file: 'dist/ui.js',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      ...sharedPlugins.start,
      // Parse environment variables
      replace({
        preventAssignment: true,
        ...parseDotenv(path.resolve('./.env.ui')),
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
          path: path.resolve('./postcss.config.js'),
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
      ...sharedPlugins.end,
    ],
  },
];
