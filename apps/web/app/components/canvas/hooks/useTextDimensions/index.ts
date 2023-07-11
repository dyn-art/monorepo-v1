import React from 'react';
import { logger } from '../../../../core/logger';
import { useFontLoading } from '../useFontLoading';
import getStringDimensions from './get-string-dimensions';

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
        words
          .filter((word) => word !== '')
          .map((word) => {
            const wordDimensions = getStringDimensions(word, style);
            return {
              word,
              width: wordDimensions.width ?? 0,
              height: wordDimensions.height ?? 0,
            };
          })
      );
    }

    // Calculate space width
    const spaceDimensions = getStringDimensions('\u00A0', style);

    // TODO: REMOVE
    logger.info(characters, { spaceDimensions, wordsWithWidthPerLine });

    return {
      hasLoaded: true,
      spaceWidth: spaceDimensions.width ?? 0,
      spaceHeight: spaceDimensions.height ?? 0,
      lines: wordsWithWidthPerLine,
    };
  }, [characters, style, font.hasLoaded]);
}

type TWordWithWidth = {
  word: string;
  width: number;
  height: number;
};

export type TUseTextDimensionsResponse =
  | {
      hasLoaded: true;
      lines: TWordWithWidth[][];
      spaceWidth: number;
      spaceHeight: number;
    }
  | { hasLoaded: false };
