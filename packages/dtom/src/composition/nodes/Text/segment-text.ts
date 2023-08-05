// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
// https://github.com/tc39/proposal-intl-segmenter

import { TLocaleCode } from './language';

export const { segmentText } = (() => {
  let wordSegmenter: any;
  let graphemeSegmenter: any;

  /**
   * Segments the given text based on the specified granularity.
   */
  function segmentText(
    text: string,
    granularity: TGranularityType,
    locales?: TLocaleCode | TLocaleCode[]
  ): string[] {
    // Check if Intl.Segmenter is available
    if (!(typeof Intl !== 'undefined' && 'Segmenter' in Intl)) {
      throw new Error(
        'Intl.Segmenter does not exist, please use import a polyfill.'
      );
    }

    // Initialize segmenter classes
    initSegmenterClasses(locales);

    // Segment text
    return granularity === 'grapheme'
      ? segmentGrapheme(text)
      : segmentWord(text);
  }

  /**
   * Helper method to segment the text into grapheme clusters.
   */
  function segmentGrapheme(text: string): string[] {
    return [...graphemeSegmenter!.segment(text)].map((seg) => seg.segment);
  }

  /**
   * Helper method to segment the text into words.
   */
  function segmentWord(text: string): string[] {
    const segmentedWords = [...wordSegmenter!.segment(text)].map(
      (seg) => seg.segment
    );

    // If a non-breaking space is found,
    // join the word before and the word after the non-breaking space into a single segment
    // https://www.fileformat.info/info/unicode/char/00a0/index.htm
    const segments: string[] = [];
    for (let i = 0; i < segmentedWords.length; i++) {
      if (
        segmentedWords[i] === '\u00a0' &&
        i !== 0 &&
        i !== segmentedWords.length - 1
      ) {
        const joinedWord = segments.pop() + '\u00a0' + segmentedWords[++i];
        segments.push(joinedWord);
      } else {
        segments.push(segmentedWords[i]);
      }
    }

    return segments;
  }

  function initSegmenterClasses(locales?: TLocaleCode | TLocaleCode[]) {
    if (!wordSegmenter) {
      wordSegmenter = new (Intl as any).Segmenter(locales, {
        granularity: 'word',
      });
    }
    if (!graphemeSegmenter) {
      graphemeSegmenter = new (Intl as any).Segmenter(locales, {
        granularity: 'grapheme',
      });
    }
  }

  return { segmentText };
})();

type TGranularityType = 'word' | 'grapheme';
