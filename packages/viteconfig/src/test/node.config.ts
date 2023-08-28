import { defineConfig } from 'vitest/config';

// https://github.com/aleclarson/vite-tsconfig-paths/issues/75
const tsconfigPaths = require('vite-tsconfig-paths').default;

export const nodeConfig = defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  plugins: [tsconfigPaths()],
});
