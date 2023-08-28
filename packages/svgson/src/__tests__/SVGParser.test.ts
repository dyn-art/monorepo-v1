import fs from 'fs';
import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { SVGParser } from '../SVGParser';

describe('SVGParser class tests', () => {
  let svgParser: SVGParser;

  beforeEach(() => {
    svgParser = new SVGParser();
  });

  it.each(['test1'])(
    `should correctly parse '%s.svg' to json and match expected result`,
    async (testCaseName) => {
      // Arrange
      const svgString = fs
        .readFileSync(
          path.resolve(__dirname, `./resources/${testCaseName}/input.svg`)
        )
        .toString();
      const expectedResult = fs
        .readFileSync(
          path.resolve(__dirname, `./resources/${testCaseName}/expected.json`)
        )
        .toString();

      // Act
      const result = svgParser.parse(svgString);

      // Assert
      expect(result).toStrictEqual(JSON.parse(expectedResult));
    }
  );
});
