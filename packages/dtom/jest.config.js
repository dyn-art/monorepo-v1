/** @type {import('jest').Config} */
module.exports = {
  preset: '@pda/jest-presets/jest/node',
  moduleNameMapper: {
    '^d3-(.*)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js', // https://stackoverflow.com/questions/69075510/jest-tests-failing-on-d3-import
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
