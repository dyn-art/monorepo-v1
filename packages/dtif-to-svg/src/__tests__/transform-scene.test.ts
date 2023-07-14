import { TScene } from '@pda/types/dtif';
import fs from 'fs';
import path from 'path';
import { transformScene } from '../transforms';

function cleanStr(str: string) {
  return str.replace(/[\s\n]/g, '');
}

describe('transformScene() method tests', () => {
  it.each(['test1'])(
    `should correctly parse '%s.json' to svg and match expected result`,
    async (testCaseName) => {
      // Arrange
      const dtifJson = fs.readFileSync(
        path.resolve(__dirname, `./resources/${testCaseName}/input.json`),
        'utf-8'
      );
      const dtif: TScene = JSON.parse(dtifJson);
      const expectedResult = fs.readFileSync(
        path.resolve(__dirname, `./resources/${testCaseName}/expected.svg`),
        'utf-8'
      );

      // Act
      const result = await transformScene(dtif);
      const resultString = result.node().outerHTML;

      console.log('\n\n---\n\n', resultString, '\n\n---\n\n');

      // Assert
      expect(cleanStr(resultString)).toStrictEqual(cleanStr(expectedResult));
    }
  );
});
