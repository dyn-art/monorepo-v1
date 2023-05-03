const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['pda-base'],
  ignorePatterns: ['ui'],
};
