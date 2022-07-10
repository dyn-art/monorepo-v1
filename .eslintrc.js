module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-pa`
  extends: ["pa"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
