import { TComposition } from '@pda/types/dtif';
import fs from 'fs';
import path from 'path';
import { Composition } from '../scene';

function cleanStr(str: string) {
  return str.replace(/[\s\n]/g, '');
}

describe('Scene class tests', () => {
  it.each(['test1'])(
    `should correctly parse '%s.json' to svg and match expected result`,
    async (testCaseName) => {
      // Arrange
      const dtifJson = fs.readFileSync(
        path.resolve(__dirname, `./resources/${testCaseName}/input.json`),
        'utf-8'
      );
      const dtif: TComposition = JSON.parse(dtifJson);
      const expectedResult = fs.readFileSync(
        path.resolve(__dirname, `./resources/${testCaseName}/expected.svg`),
        'utf-8'
      );

      // Act
      const result = await new Composition(dtif).init();
      const svgResult = result.toSVG() ?? '';

      console.log('\n\n---\n\n', svgResult, '\n\n---\n\n');

      // Assert
      expect(result).not.toBeNull();
      expect(cleanStr(svgResult)).toStrictEqual(cleanStr(expectedResult));
    }
  );
});
