const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const postcssConfig = require('./postcss.config');

/** @type { import('webpack').Configuration } */
module.exports = {
  entry: {
    ui: path.resolve('./src/ui/index.tsx'),
    code: path.resolve('./src/background/index.ts'),
  },
  module: {
    rules: [
      // Typescript Loader (Converts TypeScript code to JavaScript)
      {
        use: 'ts-loader',
        test: /\.([cm]?ts|tsx)$/,
        exclude: /node_modules/,
      },
      // PostCSS & Tailwind Loader
      {
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ...postcssConfig,
              },
            },
          },
        ],
        test: /\.css$/i,
      },
    ],
  },
  plugins: [
    // Copy static files into 'dist' bundle
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('./manifest.json'),
          to: path.resolve('./dist'),
        },
      ],
    }),
    // Html Loader (from React Component chunk)
    new HtmlPlugin({
      inject: 'body',
      template: './src/ui/index.html',
      filename: `ui.html`,
      chunks: ['ui'],
    }),
    // Inlines the JavaScript code from 'ui' chunk
    // directly into the 'ui.html' file, making it compatible with the Figma plugin API
    // which seems to only like one file instead of a separate source file
    new HtmlInlineScriptPlugin(),
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },
  output: {
    // Creates and names bundles based on 'chunk' names
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        ui: {
          name: 'ui',
          test: (m, chunks) => {
            // Apply envUI only to the 'ui' chunk
            if (chunks.some((chunk) => chunk.name === 'ui')) {
              m.factory.arguments[0].plugins.unshift(defineEnv(envUI));
            }
            return false;
          },
        },
        code: {
          name: 'code',
          test: (m, chunks) => {
            // Apply envCode only to the 'code' chunk
            if (chunks.some((chunk) => chunk.name === 'code')) {
              m.factory.arguments[0].plugins.unshift(defineEnv(envCode));
            }
            return false;
          },
        },
      },
    },
  },
};
