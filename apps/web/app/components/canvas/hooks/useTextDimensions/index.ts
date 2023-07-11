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

    const characterLines = characters.toString().split('\n');
    const wordsWithWidthPerLine: TWordWithWidth[][] = [];

    // Split text into words at space
    for (const characterLine of characterLines) {
      const words: string[] =
        characters == null
          ? []
          : characterLine.toString().split(/(?:(?!\u00A0+)\s+)/);

      // Calculate words width
      wordsWithWidthPerLine.push(
        words.map((word) => ({
          word,
          width: getStringWidth(word, style) as number,
        }))
      );
    }

    // Calculate space width
    const spaceWidth = getStringWidth('\u00A0', style);

    return {
      hasLoaded: true,
      spaceWidth,
      lines: wordsWithWidthPerLine,
    };
  }, [characters, style, font.hasLoaded]);
}

type TWordWithWidth = {
  word: string;
  width: number;
};

export type TUseTextDimensionsResponse =
  | {
      hasLoaded: true;
      lines: TWordWithWidth[][];
      spaceWidth: number;
    }
  | { hasLoaded: false };
