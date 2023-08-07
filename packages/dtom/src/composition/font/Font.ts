import {
  TFontStyle,
  TFontWeight,
  TTypefaceContext,
  Typeface,
} from './Typeface';
import { TLocaleCode } from './language';

// TODO: move to font

export class Font {
  public readonly name: string;
  private readonly _typefaces: Record<string, Typeface> = {};
  private _defaultTypefaceKey: string | null = null;

  constructor(name: string) {
    this.name = name;
  }

  public getTypeface(
    fontWeight: TFontWeight,
    fontStyle: TFontStyle = 'regular',
    locale: TLocaleCode = 'unknown'
  ): Typeface | null {
    const typeFaceKey = Typeface.constructKey(fontWeight, fontStyle, locale);
    return typeFaceKey in this._typefaces ? this._typefaces[typeFaceKey] : null;
  }

  public resolveTypeface(
    word: string,
    context: { weight?: TFontWeight; style?: TFontStyle } = {},
    options: { useFallback?: boolean } = {}
  ): Typeface | null {
    const { weight: fontWeight, style: fontStyle } = context;
    const { useFallback = true } = options;
    let finalTypeface: Typeface | null = null;

    // Try to find matching typeface that has a glyph for each char in the word
    for (const typefaceKey in this._typefaces) {
      const typeface = this._typefaces[typefaceKey];
      const matchesWeight =
        fontWeight == null || fontWeight === typeface.weight;
      const matchesStyle = fontStyle == null || fontStyle === typeface.style;
      if (matchesWeight && matchesStyle && typeface.canDisplay(word)) {
        finalTypeface = typeface;
        break;
      }
    }

    // If not variant found, try to use fallback
    if (finalTypeface == null && useFallback) {
      finalTypeface =
        this._defaultTypefaceKey != null
          ? this._typefaces[this._defaultTypefaceKey]
          : null;
    }

    return finalTypeface;
  }

  public addTypeface(
    data: Uint8Array | ArrayBuffer | Buffer,
    context: TTypefaceContext = {}
  ): Typeface {
    const typeFace = new Typeface(data, context);
    this._typefaces[typeFace.key] = typeFace;

    // Use first font as default font fallback
    if (this._defaultTypefaceKey == null) {
      this._defaultTypefaceKey = typeFace.key;
    }

    return typeFace;
  }
}
