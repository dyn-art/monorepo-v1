const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['pda-base', 'plugin:tailwindcss-jsx/recommended'],
  ignorePatterns: [
    'postcss.config.js',
    'remotion.config.ts',
    'tailwind.config.js',
    'webpack-override.ts',
  ],
};
