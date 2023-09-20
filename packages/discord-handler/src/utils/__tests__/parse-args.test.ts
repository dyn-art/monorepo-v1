import { TParseArgsConfig, parseArgs } from '../parse-args';

describe('parseArgs() method tests', () => {
  const testCases: [string[], TParseArgsConfig, Map<string, any>][] = [
    // Test case 1: Basic string option
    [
      ['-n', 'John', '--age', '25'],
      {
        options: [
          { type: 'string', name: 'name', short: 'n' },
          { type: 'number', name: 'age' },
        ],
      },
      new Map<string, any>([
        ['name', 'John'],
        ['age', 25],
      ]),
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
      new Map<string, any>([
        ['age', 25],
        ['isStudent', true],
      ]),
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
      new Map<string, any>([['courses', ['Math', 'Science', 'History']]]),
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
      new Map<string, any>([
        ['scores', [45, 60, 32]],
        ['days', ['Mon', 'Tue', 'Wed']],
      ]),
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
      new Map<string, any>([
        ['name', 'John'],
        ['age', null],
      ]),
    ],

    // Test case 6: Invalid value for number option
    [
      ['--age', 'abc'],
      {
        options: [{ type: 'number', name: 'age' }],
      },
      new Map<string, any>([['age', null]]),
    ],

    // Test case 7: Invalid value for boolean option
    [
      ['--isStudent', 'not-a-boolean'],
      {
        options: [{ type: 'boolean', name: 'isStudent' }],
      },
      new Map<string, any>([['isStudent', null]]),
    ],
  ];

  test.each(testCases)('parseArgs(%i, %i) should be %i', (a, b, c) => {
    expect(parseArgs(a, b)).toEqual(c);
  });
});
