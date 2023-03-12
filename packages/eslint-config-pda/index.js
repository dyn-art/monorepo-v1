const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended"
    "plugin:@typescript-eslint/recommended",
    "turbo",
    "prettier",
  ],
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/no-use-before-define": OFF,
    "@typescript-eslint/lines-between-class-members": OFF,
    "@typescript-eslint/naming-convention": WARNING,
    "@typescript-eslint/no-unused-vars": WARNING,
    "@typescript-eslint/ban-ts-comment": WARNING,
    "@typescript-eslint/no-var-requires": WARNING,
  },
};
