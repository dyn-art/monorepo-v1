import { TVector } from '@pda/types/dtif';
import opentype from 'opentype.js';
import {
  TEnhancedOpenTypeFont,
  enhanceOpenTypeFont,
} from './enhance-opentype-font';
import { TLocaleCode } from './language';

export class Typeface {
  public readonly key: string;

  public readonly weight: number;
  public readonly style: TFontStyle;
  public readonly opentype: TEnhancedOpenTypeFont;

  public static REGULAR_FONT_WEIGHT = 400;

  constructor(
    data: ArrayBuffer | Uint8Array | Buffer,
    context: TTypefaceContext = {}
  ) {
    const {
      style: fontStyle = 'regular',
      weight: fontWeight = Typeface.REGULAR_FONT_WEIGHT,
    } = context;
    this.style = fontStyle;
    this.weight = fontWeight;
    this.key = Typeface.constructKey(fontWeight, fontStyle);
    this.opentype = enhanceOpenTypeFont(
      opentype.parse(Typeface.toOpentypeCompatible(data))
    );
  }

  /**
   * Calculates the font metric for ascender or descender.
   *
   * According to W3C standards:
   * 1. For OpenType or TrueType fonts, it's recommended to use metrics "sTypoAscender" and "sTypoDescender"
   *    from the font's OS/2 table when available.
   * 2. In the absence of these metrics, the "Ascent" and "Descent" metrics from the HHEA table should be employed.
   *
   * Both metrics are then scaled to the current element's font size.
   *
   * @see {@link https://www.w3.org/TR/css-inline-3/#css-metrics CSS Inline Layout Module Level 3}
   * @see {@link https://www.w3.org/TR/CSS2/visudet.html#leading CSS 2 Visual formatting model details}
   *
   * @param fontSize - The current element's font size.
   * @param metric - The desired font metric ('ascender' or 'descender').
   * @param useOS2Table - A flag to indicate if the OS/2 table should be used. Default is `false`.
   * @returns The calculated metric value scaled to the font size.
   */
  public calculateFontMetric(
    fontSize: number,
    metric: 'ascender' | 'descender',
    useOS2Table = false
  ) {
    let tableValue: number | null = null;
    if (useOS2Table) {
      tableValue =
        metric === 'ascender'
          ? this.opentype.tables.os2?.sTypoAscender
          : this.opentype.tables.os2?.sTypoDescender;
    }
    const metricValue = tableValue ?? this.opentype[metric];
    return (metricValue / this.opentype.unitsPerEm) * fontSize;
  }

  /**
   * Calculates the baseline for a given text based on font size and line height.
   *
   * @param fontSize - The font size of the text.
   * @param lineHeight - The line height used for the text.
   * @returns The calculated baseline for the text.
   */
  public baseline(fontSize: number, lineHeight: number): number {
    const ascender = this.calculateFontMetric(fontSize, 'ascender');
    const descender = this.calculateFontMetric(fontSize, 'descender');
    const glyphHeight = this.height(fontSize, lineHeight);
    const { yMax, yMin } = this.opentype.tables.head;

    // Calculate the scaled glyph height and the baseline offset
    const scaledGlyphHeight = ascender - descender;
    const baselineOffset = (yMax / (yMax - yMin) - 1) * scaledGlyphHeight;

    return glyphHeight * ((1.2 / lineHeight + 1) / 2) + baselineOffset;
  }

  /**
   * Calculates the height of a given text based on font size and line height.
   *
   * @param fontSize - The font size of the text.
   * @param lineHeight - The line height used for the text.
   * @returns The calculated height for the text.
   */
  public height(fontSize: number, lineHeight: number): number {
    const ascender = this.calculateFontMetric(fontSize, 'ascender');
    const descender = this.calculateFontMetric(fontSize, 'descender');
    return ((ascender - descender) * lineHeight) / 1.2;
  }

  /**
   * Determines if the typeface contains glyphs for every character in the specified word.
   *
   * @param {string} word - The word or string to verify for display compatibility.
   * @returns {boolean} Returns `true` if the typeface can display the entire word, otherwise `false`.
   */
  public canDisplay(word: string): boolean {
    if (word === ' ' || word === '\n') {
      return true;
    }
    return this.opentype.canDisplay(word);
  }

  /**
   * Retrieves the SVG path data representation of the given text string using the current typeface.
   *
   * @param {string} text - The text string to convert to SVG path data.
   * @param {Object} config - Configuration object for the SVG conversion.
   * @param {number} config.fontSize - Size of the font in SVG units.
   * @param {TVector} config.position - Start position of the text. This is where the baseline of the first character will be drawn.
   * @param {number} config.letterSpacing - The amount of space (in SVG units) to insert between letters. This is divided by the font size for scaling.
   * @returns {string} The SVG path data representation of the text.
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
   * Helper method to construct a font variant identifier.
   *
   * The identifier construction is inspired by the Google Font API.
   * https://developers.google.com/fonts/docs/developer_api
   *
   * e.g. 'regular', '100', '200', '200itlaic'
   */
  public static constructKey(
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

  /**
   * Helper method to convert data to a format compatible with opentype.js.
   * This function accepts an ArrayBuffer, a Uint8Array, or a Node.js Buffer.
   * Note that Node.js Buffer is not available in browsers.
   */
  public static toOpentypeCompatible(
    data: ArrayBuffer | Uint8Array | Buffer
  ): ArrayBuffer {
    if ('buffer' in data) {
      // If data has a 'buffer' property, it's a Uint8Array or a Node.js Buffer.
      // Slice the buffer to get the correct portion.
      return data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength
      );
    }

    // If data is already an ArrayBuffer, return it directly
    return data as ArrayBuffer;
  }
}

export type TFontStyle = 'regular' | 'italic';
export type TFontWeight = number;
export type TTypefaceContext = {
  style?: TFontStyle;
  weight?: TFontWeight;
};
