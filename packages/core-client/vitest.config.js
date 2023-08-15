require('dotenv').config({ path: '.env.test.local' });

/** @type {import('jest').Config} */
module.exports = {
  preset: '@pda/viteconfig/jest/node',
};
