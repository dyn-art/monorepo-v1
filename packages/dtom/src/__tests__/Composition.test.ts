import { TComposition } from '@dyn/types/dtif';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { Composition, TextSegmenter } from '../composition';

describe('dtom tests', () => {
  const testCases = ['test2'];

  for (const testCaseName of testCases) {
    it(`should correctly parse '${testCaseName}.json' to svg and match expected result`, async () => {
      await TextSegmenter.loadIntlSegmenterPolyfill();

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
      expect(result).not.toBe(null);
      expect(cleanStr(svgResult)).toBe(cleanStr(expectedResult));
    });
  }
});

function cleanStr(str: string) {
  return str.replace(/[\s\n]/g, '');
}
