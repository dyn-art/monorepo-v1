import opentype from 'opentype.js';
import {
  TEnhancedOpenTypeFont,
  enhanceOpenTypeFont,
} from './enhance-opentype-font';
import { segmentText } from './segment-text';

export class Font {
  public readonly name: string;
  private readonly _variants: Record<string, TFontVariant>;
  private _defaultVariantKey: string | null;

  public static REGULAR_FONT_WEIGHT = 400;

  constructor(name: string) {
    this.name = name;
    this._variants = {};
    this._defaultVariantKey = null;
  }

  public getVariant(
    fontWeight: TFontVariant['weight'],
    fontStyle: TFontVariant['style'] = 'regular'
  ): TFontVariant | null {
    const variantKey = this.constructVariantKey(fontWeight, fontStyle);
    return variantKey in this._variants ? this._variants[variantKey] : null;
  }

  public addVariant(
    data: Uint8Array | ArrayBuffer | Buffer,
    context: TFontContentContext = {}
  ): TFontVariant {
    const {
      style: fontStyle = 'regular',
      weight: fontWeight = Font.REGULAR_FONT_WEIGHT,
    } = context;

    // Parse font data to opentype font
    const variantKey = this.constructVariantKey(fontWeight, fontStyle);
    const font = enhanceOpenTypeFont(
      opentype.parse(this.toOpentypeCompatible(data))
    );

    const fontVariant = {
      font,
      style: fontStyle,
      weight: fontWeight,
    };
    this._variants[variantKey] = fontVariant;

    // Use first font as default font fallback
    if (this._defaultVariantKey == null) {
      this._defaultVariantKey = variantKey;
    }

    return fontVariant;
  }

  public has(word: string) {
    // TODO: check in font if font can display word
    return true;
  }

  // TODO:
  public getMissingGraphemes(word: string) {
    const missingGraphemes = segmentText(word, 'grapheme').filter(
      (grapheme) => !this.has(word)
    );

    return false;
  }

  // ============================================================================
  // Helper
  // ============================================================================

  /**
   * Helper method to build font variant identifier key.
   *
   * e.g. 'regular', '100', '200', '200itlaic'
   */
  private constructVariantKey(
    fontWeight: TFontVariant['weight'] = Font.REGULAR_FONT_WEIGHT,
    fontStyle: TFontVariant['style'] = 'regular'
  ) {
    if (fontWeight === Font.REGULAR_FONT_WEIGHT) {
      return fontStyle;
    } else if (fontStyle === 'regular') {
      return `${fontWeight}`;
    } else {
      return `${fontWeight}${fontStyle}`;
    }
  }

  /**
   * Helper method to convert data to a format compatible with opentype.js.
   * This function accepts an ArrayBuffer, a Uint8Array, or a Node.js Buffer.
   * Note that Node.js Buffer is not available in browsers.
   */
  private toOpentypeCompatible(
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

type TFontVariantMixin = {
  weight: number;
  style: 'regular' | 'italic';
};

type TFontVariant = {
  font: TEnhancedOpenTypeFont;
} & TFontVariantMixin;

type TFontContentContext = Partial<TFontVariantMixin>;
