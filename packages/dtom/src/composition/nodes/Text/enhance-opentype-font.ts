/**
 * Enhances the given opentype Font object with custom functionality.
 */
export function enhanceOpenTypeFont(
  font: opentype.Font
): TEnhancedOpenTypeFont {
  const enhancedFont = font as TEnhancedOpenTypeFont;

  // Override the charToGlyphIndex() method
  // to track characters without glyphs
  const originalCharToGlyphIndex = enhancedFont.charToGlyphIndex;
  enhancedFont.charToGlyphIndex = (char: string) => {
    const index = originalCharToGlyphIndex.call(enhancedFont, char);
    if (index === 0) {
      enhancedFont._charsWithoutMatchingGlyph?.push(char);
    }
    return index;
  };

  // Method to check whether the font has a matching glyph for each char in the word
  enhancedFont.hasAllGlyphs = (word: string) => {
    enhancedFont._charsWithoutMatchingGlyph = [];
    enhancedFont.stringToGlyphs(word);
    const supportsAllChars =
      enhancedFont._charsWithoutMatchingGlyph.length === 0;
    enhancedFont._charsWithoutMatchingGlyph = undefined;
    return supportsAllChars;
  };

  return enhancedFont;
}

export interface TEnhancedOpenTypeFont extends opentype.Font {
  _charsWithoutMatchingGlyph?: string[];
  hasAllGlyphs: (word: string) => boolean;
}
