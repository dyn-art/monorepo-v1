import React from 'react';
import { useFontLoading } from '../useFontLoading';
import getStringWidth from './get-string-width';

export function useTextDimensions(
  characters: string | number,
  style: React.CSSProperties
): TUseTextDimensionsResponse {
  const font = useFontLoading({
    family: style?.fontFamily,
    weight: style?.fontWeight,
  });

  return React.useMemo(() => {
    // Check whether font has loaded,
    // because without loaded font the width of the words can't be determined correctly
    if (!font.hasLoaded) {
      return { hasLoaded: false };
    }

    // Split text into words at space
    const words: string[] =
      characters == null
        ? []
        : characters.toString().split(/(?:(?!\u00A0+)\s+)/);

    // Calculate words width
    const wordsWithWidth: WordWithWidth[] = words.map((word) => ({
      word,
      width: getStringWidth(word, style) as number,
    }));

    // Calculate space width
    const spaceWidth = getStringWidth('\u00A0', style);

    return { hasLoaded: true, wordsWithWidth, spaceWidth };
  }, [characters, style, font.hasLoaded]);
}

export type WordWithWidth = {
  word: string;
  width: number;
};

export type TUseTextDimensionsResponse =
  | { hasLoaded: true; wordsWithWidth: WordWithWidth[]; spaceWidth: number }
  | { hasLoaded: false };
