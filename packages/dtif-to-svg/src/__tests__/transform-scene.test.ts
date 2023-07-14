import { TScene } from '@pda/types/dtif';
import fs from 'fs';
import path from 'path';
import { transformScene } from '../transforms';

describe('transformScene() method tests', () => {
  it.each(['test1', 'figma-export-2'])(
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

      // Assert
      expect(result).toStrictEqual(expectedResult);
    }
  );
});
