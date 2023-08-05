/**
 * Enhances the given opentype Font object with custom functionality.
 */
export function enhanceOpenTypeFont(
  font: opentype.Font
): TEnhancedOpenTypeFont {
  const enhancedFont = font as TEnhancedOpenTypeFont;

  // Override the charToGlyphIndex() method
  // to track characters without glyphs
  enhancedFont._trackBrokenChars = [];
  const originalCharToGlyphIndex = enhancedFont.charToGlyphIndex;
  enhancedFont.charToGlyphIndex = (char: string) => {
    const index = originalCharToGlyphIndex.call(enhancedFont, char);
    if (index === 0) {
      enhancedFont._trackBrokenChars?.push(char);
    }
    return index;
  };

  return enhancedFont;
}

export interface TEnhancedOpenTypeFont extends opentype.Font {
  _trackBrokenChars?: string[];
}
