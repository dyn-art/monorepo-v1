import { WebpackOverrideFn } from 'remotion';
import * as postcssConfig from './postcss.config';

// Based on:
// https://github.com/remotion-dev/template-tailwind

export const webpackOverride: WebpackOverrideFn = (currentConfiguration) => {
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
