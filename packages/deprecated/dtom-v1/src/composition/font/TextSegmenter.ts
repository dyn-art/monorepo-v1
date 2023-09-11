import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill';
import LineBreaker from 'linebreak';
import { TLocaleCode } from './helper/language';

export class TextSegmenter {
  private _wordSegmenter: Intl.Segmenter;
  private _graphemeSegmenter: Intl.Segmenter;

  constructor(
    options: {
      IntlSegmenter?: typeof Intl.Segmenter;
      locales?: TLocaleCode | TLocaleCode[];
    } = {}
  ) {
    const GlobalThisIntlSegmenter =
      typeof Intl !== 'undefined' && 'Segmenter' in Intl
        ? Intl.Segmenter
        : null;
    const { locales = [], IntlSegmenter = GlobalThisIntlSegmenter } = options;
    if (IntlSegmenter == null) {
      // https://caniuse.com/mdn-javascript_builtins_intl_segments
      throw new Error(
        'Intl.Segmenter does not exist, please use import a polyfill.'
      );
    }

    this._wordSegmenter =
      this._wordSegmenter ||
      new IntlSegmenter(locales as string, { granularity: 'word' });
    this._graphemeSegmenter =
      this._graphemeSegmenter ||
      new IntlSegmenter(locales as string, { granularity: 'grapheme' });
  }

  public static async loadIntlSegmenterPolyfill() {
    if (!globalThis.Intl || !globalThis.Intl.Segmenter) {
      await createIntlSegmenterPolyfill(
        fetch(new URL('intl-segmenter-polyfill/dist/break_iterator.wasm'))
      );
    }
  }

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
  public segment(text: string, granularity: TGranularityType): string[] {
    return granularity === 'grapheme'
      ? this.segmentGrapheme(text)
      : this.segmentWord(text);
  }

  /**
   * Segments the text into grapheme clusters.
   *
   * @param text - Text to be segmented.
   * @returns Array of graphemes.
   */
  private segmentGrapheme(text: string): string[] {
    return [...this._graphemeSegmenter.segment(text)].map((seg) => seg.segment);
  }

  /**
   * Segments the text into words, considering non-breaking spaces.
   *
   * @param text - Text to be segmented.
   * @returns Array of words.
   */
  private segmentWord(text: string): string[] {
    const segmentedWords = [...this._wordSegmenter.segment(text)].map(
      (seg) => seg.segment
    );
    return this.handleNonBreakingSpaces(segmentedWords);
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
  private handleNonBreakingSpaces(segmentedWords: string[]): string[] {
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

  /**
   * Splits text by break opportunities based on the given word break rule.
   *
   * @param text The input string content.
   * @param wordBreak The word break rule.
   * @returns An array of objects containing the word and its required break.
   */
  public splitByBreakOpportunities(
    text: string,
    wordBreak: TTextBreak = 'uax-14'
  ): TTextSegment[] {
    switch (wordBreak) {
      case 'break-all':
        return this.breakAll(text);
      case 'keep-all':
        return this.keepAll(text);
      default:
        return this.defaultBreak(text);
    }
  }

  private breakAll(content: string): TTextSegment[] {
    const segments = this.segment(content, 'grapheme');
    return segments.map((segment) => ({ segment, requiredBreak: false }));
  }

  private keepAll(content: string): TTextSegment[] {
    const segments = this.segment(content, 'word');
    return segments.map((segment) => ({ segment, requiredBreak: false }));
  }

  // https://www.npmjs.com/package/linebreak
  private defaultBreak(content: string): TTextSegment[] {
    const breaker = new LineBreaker(content);
    const textSegments: TTextSegment[] = [];
    let lastBreakPoint = 0;
    let nextBreak = breaker.nextBreak();

    while (nextBreak) {
      const segment = content.slice(lastBreakPoint, nextBreak.position);
      textSegments.push({ segment, requiredBreak: nextBreak.required });

      lastBreakPoint = nextBreak.position;
      nextBreak = breaker.nextBreak();
    }

    return textSegments;
  }
}

type TGranularityType = 'word' | 'grapheme';
export type TTextBreak = 'break-all' | 'keep-all' | 'uax-14';
export type TTextSegment = { segment: string; requiredBreak: boolean };
