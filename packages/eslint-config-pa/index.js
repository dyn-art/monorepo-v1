const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "next"
  ],
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  rules: {
    "@next/next/no-html-link-for-pages": OFF,
    "react/jsx-key": OFF,
  },
};