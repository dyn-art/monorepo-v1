import {
  TParseArgsConfig,
  parseArgs,
} from '../../core/discord/utils/parse-args';

describe('parseArgs() tests', () => {
  const testCases: [string[], TParseArgsConfig, Record<string, any>][] = [
    // Test case 1: Basic string option
    [
      ['-n', 'John', '--age', '25'],
      {
        options: [
          { type: 'string', name: 'name', short: 'n' },
          { type: 'number', name: 'age' },
        ],
      },
      { name: 'John', age: 25 },
    ],

    // Test case 2: Basic number and boolean options
    [
      ['-n', '25', '--isStudent'],
      {
        options: [
          { type: 'number', name: 'age', short: 'n' },
          { type: 'boolean', name: 'isStudent' },
        ],
      },
      { age: 25, isStudent: true },
    ],

    // Test case 3: Array options with custom splitBy
    [
      ['--courses', 'Math-Science-History'],
      {
        options: [
          {
            type: 'string',
            name: 'courses',
            isArray: { splitBy: '-' },
          },
        ],
      },
      { courses: ['Math', 'Science', 'History'] },
    ],

    // Test case 4: Multiple array options with mixed types
    [
      ['--scores', '45,60,32', '--days', 'Mon-Tue-Wed'],
      {
        options: [
          { type: 'number', name: 'scores', isArray: true },
          { type: 'string', name: 'days', isArray: { splitBy: '-' } },
        ],
      },
      { scores: [45, 60, 32], days: ['Mon', 'Tue', 'Wed'] },
    ],

    // Test case 5: Missing optional option
    [
      ['--name', 'John'],
      {
        options: [
          { type: 'string', name: 'name' },
          { type: 'number', name: 'age', optional: true },
        ],
      },
      { name: 'John', age: null },
    ],

    // Test case 6: Invalid value for number option
    [
      ['--age', 'abc'],
      {
        options: [{ type: 'number', name: 'age' }],
      },
      { age: null },
    ],

    // Test case 7: Invalid value for boolean option
    [
      ['--isStudent', 'not-a-boolean'],
      {
        options: [{ type: 'boolean', name: 'isStudent' }],
      },
      { isStudent: null },
    ],
  ];

  test.each(testCases)('parseArgs(%i, %i) should be %i', (a, b, c) => {
    expect(parseArgs(a, b)).toStrictEqual(c);
  });
});
