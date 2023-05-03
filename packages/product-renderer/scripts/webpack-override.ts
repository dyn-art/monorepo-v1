import { WebpackConfiguration } from 'remotion';

// Using 'require' instead of 'import' to bypass TypeScript compilation issue
// when loading 'postcss.config.js' located outside the 'rootDir'.
// This is a workaround to avoid the error:
// "File 'postcss.config.js' is not under 'rootDir'. 'rootDir' is expected to contain all source files."
const postcssConfig = require('../ui/postcss.config.js');

// Based on:
// https://github.com/remotion-dev/template-tailwind

export const webpackOverride = (
  currentConfiguration: WebpackConfiguration
): WebpackConfiguration => {
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules
          ? currentConfiguration.module.rules
          : []
        ).filter((rule) => {
          if (rule === '...') {
            return false;
          }
          if (rule.test?.toString().includes('.css')) {
            return false;
          }
          return true;
        }),
        {
          test: /\.css$/i,
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
        },
        // https://stackoverflow.com/questions/49437048/module-parse-failed-unexpected-token-m-in-json-at-position-0
        // { test: /\.json$/, loader: 'json-loader' },
      ],
    },
  };
};
