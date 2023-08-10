import { toArrayBuffer } from '@/helpers';
import { logger } from '@/logger';
import { TVector } from '@pda/types/dtif';
import { shortId } from '@pda/utils';
import opentype from 'opentype.js';
import { Font } from './Font';
import { TLocaleCode, segmentText } from './helper';
import {
  TEnhancedOpenTypeFont,
  enhanceOpenTypeFont,
} from './helper/enhance-opentype-font';

export class Typeface {
  public readonly id: string;
  public readonly key: string;

  public readonly font: Font;

  public readonly displayName?: string;

  public readonly weight: number;
  public readonly style: TFontStyle;
  public readonly opentype: TEnhancedOpenTypeFont;

  public static REGULAR_FONT_WEIGHT = 400;

  private readonly _graphemeCache: Map<
    string,
    { width?: number; canDisplay?: boolean }
  > = new Map();

  constructor(
    font: Font,
    data: ArrayBuffer | Uint8Array | Buffer,
    context: TTypefaceContext = {},
    options: TTypefaceOptions = {}
  ) {
    const {
      style: fontStyle = 'regular',
      weight: fontWeight = Typeface.REGULAR_FONT_WEIGHT,
    } = context;
    const { id = shortId() } = options;
    this.id = id;
    this.style = fontStyle;
    this.weight = fontWeight;
    this.key = Typeface.buildTypefaceKey(fontWeight, fontStyle);
    this.opentype = enhanceOpenTypeFont(opentype.parse(toArrayBuffer(data)));
    this.font = font;
  }

  /**
   * Calculates the font metric for ascender, descender, or lineGap.
   *
   * According to W3C standards:
   * 1. For OpenType or TrueType fonts, it's recommended to use metrics "sTypoAscender", "sTypoDescender",
   *    and "sTypoLineGap" from the font's OS/2 table when available.
   * 2. In the absence of these metrics, the "Ascent", "Descent", and "LineGap" metrics from the HHEA table should be employed.
   *
   * Both metrics are then scaled to the current element's font size.
   *
   * @see {@link https://www.w3.org/TR/css-inline-3/#css-metrics CSS Inline Layout Module Level 3}
   * @see {@link https://www.w3.org/TR/CSS2/visudet.html#leading CSS 2 Visual formatting model details}
   *
   * @param fontSize - The current element's font size.
   * @param metric - The desired font metric ('ascender', 'descender', or 'lineGap').
   * @returns The calculated metric value scaled to the font size.
   */
  public getFontMetric(
    fontSize: number,
    metric: 'ascender' | 'descender' | 'lineGap'
  ) {
    let tableValue: number;

    switch (metric) {
      case 'ascender':
        tableValue =
          this.opentype.tables.os2?.sTypoAscender ??
          this.opentype.tables.hhea?.ascender ??
          this.opentype.ascender;
        break;
      case 'descender':
        tableValue =
          this.opentype.tables.os2?.sTypoDescender ??
          this.opentype.tables.hhea?.descent ??
          this.opentype.descender;
        break;
      case 'lineGap':
        tableValue =
          this.opentype.tables.os2?.sTypoLineGap ??
          this.opentype.tables.hhea?.lineGap ??
          0;
        break;
    }

    return (tableValue / this.opentype.unitsPerEm) * fontSize;
  }

  /**
   * Calculates the baseline for a given text based on font size and optional line height.
   * If no line height is provided, it calculates using the natural height of the text.
   *
   * @param fontSize - The font size of the text.
   * @param relativeLineHeight - Optional line height used for the text.
   * @returns The calculated baseline for the text.
   */
  public getBaseline(fontSize: number, relativeLineHeight = 1.2): number {
    const ascender = this.getFontMetric(fontSize, 'ascender');
    const descender = this.getFontMetric(fontSize, 'descender');

    const glyphHeight = this.getHeight(fontSize, relativeLineHeight);
    const { yMax, yMin } = this.opentype.tables.head;

    // Calculate the baseline offset
    const scaledGlyphHeight = ascender - descender;
    const baselineOffset = (yMax / (yMax - yMin) - 1) * scaledGlyphHeight;

    return glyphHeight / 2 + baselineOffset;
  }

  /**
   * Calculates the height of a given text based on font size and optional line height.
   * If no line height is provided, it calculates the natural height of the text.
   *
   * @param fontSize - The font size of the text.
   * @param relativeLineHeight - Optional line height used for the text.
   * @returns The calculated height for the text.
   */
  public getHeight(fontSize: number, relativeLineHeight = 1.2): number {
    const ascender = this.getFontMetric(fontSize, 'ascender');
    const descender = this.getFontMetric(fontSize, 'descender');
    const lineGap = this.getFontMetric(fontSize, 'lineGap');

    // Natural text height.
    const naturalHeight = ascender - descender + lineGap;

    // If lineHeight is provided, multiply it with the natural height.
    return relativeLineHeight
      ? naturalHeight * relativeLineHeight
      : naturalHeight;
  }

  /**
   * Determines if the typeface contains glyphs for every character in the specified word.
   *
   * @param word - The word or string to verify for display compatibility.
   * @returns Returns `true` if the typeface can display the entire word, otherwise `false`.
   */
  public canDisplay(word: string): boolean {
    if (word === ' ' || word === '\n') {
      return true;
    }
    return this.opentype.canDisplay(word);
  }

  /**
   * Calculates the width of a given grapheme based on font size and optional letter spacing.
   *
   * @param grapheme - The grapheme to calculate the width from.
   * @param config - Configuration
   * @returns The calculated width for the grapheme.
   */
  public measureGrapheme(
    grapheme: string,
    config: {
      fontSize: number;
      relativeLetterSpacing?: number;
    }
  ): number | null {
    const { fontSize, relativeLetterSpacing: letterSpacing = 0 } = config;

    // Check whether grapheme width is cached
    const cachedGrapheme = this._graphemeCache.get(grapheme);
    if (cachedGrapheme != null && cachedGrapheme.width != null) {
      return cachedGrapheme.width;
    }

    // Check whether typeface can display grapheme
    let canDisplay: boolean;
    if (cachedGrapheme != null && cachedGrapheme.canDisplay != null) {
      canDisplay = cachedGrapheme.canDisplay;
    } else {
      canDisplay = this.opentype.canDisplay(grapheme);
    }
    if (!canDisplay) {
      logger.warn(
        `Couldn't calculate width for grapheme '${grapheme}' with font '${
          this.font.name
        }' and typeface '${
          this.displayName ?? this.key
        }' as no corresponding glyph could be found!`
      );
      return null;
    }

    // Calculate width
    const width = this.opentype.getAdvanceWidth(grapheme, fontSize, {
      letterSpacing: letterSpacing / fontSize,
    });

    // Add calculated width for grapheme to cache
    if (cachedGrapheme != null) {
      cachedGrapheme.width = width;
      cachedGrapheme.canDisplay = canDisplay;
    } else {
      this._graphemeCache.set(grapheme, { width, canDisplay });
    }

    return width;
  }

  /**
   * Calculates the width of a given text based on font size and optional letter spacing.
   *
   * @param grapheme - The text to calculate the width from.
   * @param config - Configuration
   * @returns The calculated width for the text.
   */
  public async measureText(
    text: string,
    config: { fontSize: number; relativeLetterSpacing?: number }
  ): Promise<number> {
    const { fontSize } = config;

    const graphemes = await segmentText(text, 'grapheme');

    // Calculate text width based on the width of the graphemes the text consists of
    let width = 0;
    for (const grapheme of graphemes) {
      const graphemeWidth = this.measureGrapheme(grapheme, config);
      if (graphemeWidth != null) {
        width += graphemeWidth;
      } else {
        width += fontSize; // as fallback
      }
    }

    return width;
  }

  /**
   * Retrieves the SVG path data representation of the given text string using the current typeface.
   *
   * @param text - The text string to convert to SVG path data.
   * @param config - Configuration
   * @returns The SVG path data representation of the text.
   */
  public getSVG(
    text: string,
    config: { fontSize: number; position: TVector; letterSpacing: number }
  ) {
    const {
      position: { x, y },
      fontSize,
      letterSpacing,
    } = config;
    return this.opentype
      .getPath(text, x, y, fontSize, {
        letterSpacing: letterSpacing / fontSize,
      })
      .toPathData(1);
  }

  // ============================================================================
  // Helper
  // ============================================================================

  /**
   * Helper method to build a typeface identifier.
   *
   * The identifier construction is inspired by the Google Font API.
   * https://developers.google.com/fonts/docs/developer_api
   *
   * e.g. 'regular', '100', '200', '200itlaic'
   */
  public static buildTypefaceKey(
    fontWeight: TTypefaceContext['weight'] = Typeface.REGULAR_FONT_WEIGHT,
    fontStyle: TTypefaceContext['style'] = 'regular',
    locale: TLocaleCode = 'unknown'
  ) {
    let key = '';

    if (fontWeight === Typeface.REGULAR_FONT_WEIGHT) {
      key = fontStyle;
    } else if (fontStyle === 'regular') {
      key = `${fontWeight}`;
    } else {
      key = `${fontWeight}${fontStyle}`;
    }

    if (locale !== 'unknown') {
      key += `_${locale}`;
    }

    return key;
  }
}

export type TFontStyle = 'regular' | 'italic';
export type TFontWeight = number;
export type TTypefaceContext = {
  style?: TFontStyle;
  weight?: TFontWeight;
};
export type TTypefaceOptions = {
  id?: string;
  displayName?: string;
};
