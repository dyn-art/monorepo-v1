import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill/dist/bundled';
import { TLocaleCode } from './language';

type TGranularityType = 'word' | 'grapheme';

export const { segmentText } = (() => {
  let wordSegmenter: any | null = null;
  let graphemeSegmenter: any | null = null;

  /**
   * Segments the given text based on the specified granularity.
   *
   * https://javascript.plainenglish.io/international-text-segmentation-with-intl-segmenter-in-javascript-639eb1865263
   *
   * @param text - Text to be segmented.
   * @param granularity - Granularity type ('word' or 'grapheme').
   * @param locales - Locale or locales list for language-sensitive segmentation.
   * @returns Segmented text as an array.
   */
  async function segmentText(
    text: string,
    granularity: TGranularityType,
    locales?: TLocaleCode | TLocaleCode[]
  ): Promise<string[]> {
    await initSegmenterClasses(locales);
    return granularity === 'grapheme'
      ? segmentGrapheme(text)
      : segmentWord(text);
  }

  /**
   * Segments the text into grapheme clusters.
   *
   * @param text - Text to be segmented.
   * @returns Array of graphemes.
   */
  function segmentGrapheme(text: string): string[] {
    return [...graphemeSegmenter!.segment(text)].map((seg) => seg.segment);
  }

  /**
   * Segments the text into words, considering non-breaking spaces.
   *
   * @param text - Text to be segmented.
   * @returns Array of words.
   */
  function segmentWord(text: string): string[] {
    const segmentedWords = [...wordSegmenter!.segment(text)].map(
      (seg) => seg.segment
    );
    return handleNonBreakingSpaces(segmentedWords);
  }

  /**
   * Adjusts the segmentation of words to respect the behavior of non-breaking spaces.
   *
   * A non-breaking space (`\u00a0`) is a space character that prevents automatic line breaks at its position.
   * When this function encounters a non-breaking space that is not at the start or end of the array,
   * it will join the word before the non-breaking space with the word after it.
   * This ensures that any segments separated by a non-breaking space are treated as a single unit,
   * adhering to the typographical purpose of the non-breaking space.
   *
   * Commonly used to prevent breaking at undesirable or awkward positions,
   * like between a number and its unit (e.g. "100 km")
   *
   * @param segmentedWords - An array of words potentially containing non-breaking spaces as separate segments.
   * @returns An array of words, adjusted for non-breaking spaces.
   */
  function handleNonBreakingSpaces(segmentedWords: string[]): string[] {
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

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
  // https://github.com/tc39/proposal-intl-segmenter
  async function initSegmenterClasses(locales?: TLocaleCode | TLocaleCode[]) {
    const Segmenter = await createIntlSegmenterPolyfill();
    wordSegmenter =
      wordSegmenter ||
      new Segmenter(locales as string, { granularity: 'word' });
    graphemeSegmenter =
      graphemeSegmenter ||
      new Segmenter(locales as string, { granularity: 'grapheme' });
  }

  return { segmentText };
})();
