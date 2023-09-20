// This module guesses the human language (writing system) of the given
// JavaScript string, using the Unicode Alias in extended RegExp.
//
// You can learn more about this in:
// - https://en.wikipedia.org/wiki/Script_(Unicode)
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
// - https://unicode.org/reports/tr18/#General_Category_Property
// - https://tc39.es/ecma262/multipage/text-processing.html#table-unicode-script-values

import createEmojiRegex from 'emoji-regex';

// Creating a regex for emojis, removing the "g" flag.
const emojiRegex = new RegExp(createEmojiRegex(), '');

// Supported languages and their respective Unicode script property escape patterns
// https://en.wikipedia.org/wiki/IETF_language_tag
const LANGUAGE_CODES = {
  'ja-JP': /\p{scx=Hira}|\p{scx=Kana}|\p{scx=Han}|[\u3000]|[\uFF00-\uFFEF]/u,
  'ko-KR': /\p{scx=Hangul}/u,
  'zh-CN': /\p{scx=Han}/u,
  'zh-TW': /\p{scx=Han}/u,
  'zh-HK': /\p{scx=Han}/u,
  'th-TH': /\p{scx=Thai}/u,
  'bn-IN': /\p{scx=Bengali}/u,
  'ar-AR': /\p{scx=Arabic}/u,
  'ta-IN': /\p{scx=Tamil}/u,
  'ml-IN': /\p{scx=Malayalam}/u,
  'he-IL': /\p{scx=Hebrew}/u,
  'te-IN': /\p{scx=Telugu}/u,
  devanagari: /\p{scx=Devanagari}/u,
  kannada: /\p{scx=Kannada}/u,
} as const;

// Special cases for language code detection
const SPECIAL_CODES = {
  emoji: emojiRegex,
  symbol: /\p{Symbol}/u,
  math: /\p{Math}/u,
} as const;

export type TSpecialCode = keyof typeof SPECIAL_CODES;
export type TLanguageCode = keyof typeof LANGUAGE_CODES;
export type TLocaleCode = TSpecialCode | TLanguageCode | 'unknown';

export const localeCodes = [
  ...Object.keys(LANGUAGE_CODES),
  ...Object.keys(SPECIAL_CODES),
] as TLocaleCode[];

export function isValidLocaleCode(code: string): code is TLocaleCode {
  return localeCodes.includes(code as TLocaleCode);
}

export function detectLocaleCodeByGrapheme(
  grapheme: string, // https://en.wikipedia.org/wiki/Grapheme
  languageCode?: TLanguageCode
): TLanguageCode[] | [TSpecialCode] {
  // Check for matches with special characters
  for (const specialCode of Object.keys(SPECIAL_CODES) as TSpecialCode[]) {
    if (SPECIAL_CODES[specialCode].test(grapheme)) {
      return [specialCode];
    }
  }

  // Check for matches with language characters
  const languageCodes = Object.keys(LANGUAGE_CODES).filter((lang) =>
    LANGUAGE_CODES[lang as TLanguageCode].test(grapheme)
  ) as TLanguageCode[];

  // If a language code is provided,
  // prioritize it if it is in the list of matched languages
  if (languageCode != null) {
    const index = languageCodes.findIndex((lang) => lang === languageCode);
    if (index !== -1) {
      languageCodes.splice(index, 1);
      languageCodes.unshift(languageCode);
    }
  }

  return languageCodes;
}
