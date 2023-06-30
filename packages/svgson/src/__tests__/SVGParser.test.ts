import fs from 'fs';
import path from 'path';
import { SVGParser } from '../SVGParser';

describe('SVGParser class tests', () => {
  let svgParser: SVGParser;

  beforeEach(() => {
    svgParser = new SVGParser();
  });

  it.each(['test1'])(
    `should correctly parse '%s.svg' and match expected result`,
    async (testName) => {
      // Arrange
      const svgString = fs
        .readFileSync(path.resolve(__dirname, `./assets/${testName}.svg`))
        .toString();
      const expectedResult = fs
        .readFileSync(
          path.resolve(__dirname, `./assets/${testName}-result.json`)
        )
        .toString();

      // Act
      const result = svgParser.parse(svgString);

      // Assert
      expect(result).toStrictEqual(JSON.parse(expectedResult));
    }
  );
});
