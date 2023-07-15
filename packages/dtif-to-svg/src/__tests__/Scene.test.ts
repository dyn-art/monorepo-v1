import { TScene } from '@pda/types/dtif';
import fs from 'fs';
import path from 'path';
import { Scene } from '../canvas';

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
      const dtif: TScene = JSON.parse(dtifJson);
      const expectedResult = fs.readFileSync(
        path.resolve(__dirname, `./resources/${testCaseName}/expected.svg`),
        'utf-8'
      );

      // Act
      const result = new Scene(dtif);
      const ready = await result.ready(8000);

      // Assert
      expect(result).not.toBeNull();
      expect(ready).toBeTruthy();
    }
  );
});
