import { shortId } from '@pda/utils';
import { FontManager } from './FontManager';
import {
  TFontStyle,
  TFontWeight,
  TTypefaceContext,
  TTypefaceOptions,
  Typeface,
} from './Typeface';
import { TLocaleCode } from './helper';

export class Font {
  public readonly id: string;
  public readonly name: string;

  private readonly _typefaceKeyToIdMap: Map<string, string> = new Map();
  private _defaultTypefaceKey: string | null = null;

  private readonly _fontManager: () => FontManager;

  constructor(
    name: string,
    fontManager: FontManager,
    options: TFontOptions = {}
  ) {
    const { id = shortId() } = options;
    this.id = id;
    this.name = name;
    this._fontManager = () => fontManager;
  }

  public setTypeface(typeface: Typeface) {
    this._fontManager().setTypeface(typeface);
    this._typefaceKeyToIdMap[typeface.key] = typeface.id;

    // Use first typeface as default typeface for fallback
    if (this._defaultTypefaceKey == null) {
      this._defaultTypefaceKey = typeface.key;
    }
  }

  public createTypeface(
    data: Uint8Array | ArrayBuffer | Buffer,
    context: TTypefaceContext = {},
    options: TTypefaceOptions = {}
  ): Typeface {
    const typeface = new Typeface(this, data, context, options);
    this.setTypeface(typeface);
    return typeface;
  }

  public getTypeface(
    fontWeight: TFontWeight,
    fontStyle: TFontStyle = 'regular',
    locale: TLocaleCode = 'unknown'
  ): Typeface | null {
    const typefaceKey = Typeface.buildTypefaceKey(
      fontWeight,
      fontStyle,
      locale
    );
    const typefaceId = this._typefaceKeyToIdMap[typefaceKey];
    if (typefaceId == null) {
      return null;
    }
    return this._fontManager().getTypefaceById(typefaceId);
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
    for (const typefaceKey in this._typefaceKeyToIdMap) {
      const typeface = this._typefaceKeyToIdMap[typefaceKey];
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
          ? this._typefaceKeyToIdMap[this._defaultTypefaceKey] ?? null
          : null;
    }

    return finalTypeface;
  }
}

export type TFontOptions = {
  id?: string;
};
