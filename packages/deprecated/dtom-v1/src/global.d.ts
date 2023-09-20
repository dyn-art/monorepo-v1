declare namespace Intl {
  interface SegmenterOptions {
    granularity?: 'grapheme' | 'word' | 'sentence';
    lineBreakStyle?: 'strict' | 'loose' | 'normal';
  }

  class Segmenter {
    constructor(locales?: string | string[], options?: SegmenterOptions);
    segment(
      text: string
    ): IterableIterator<{ segment: string; breakType?: string }>;
  }
}
