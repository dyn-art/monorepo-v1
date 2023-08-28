require('dotenv').config({ path: '.env.test.local' });

/** @type {import('jest').Config} */
module.exports = {
  preset: '@dyn/jest-presets/jest/node',
};
