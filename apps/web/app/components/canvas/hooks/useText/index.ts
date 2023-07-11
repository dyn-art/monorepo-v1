import { TTextNode } from '@pda/types/dtif';
import React, { SVGAttributes } from 'react';
import { useTextDimensions } from '../useTextDimensions';
import { mapTextAlignment } from './map-text-alignment';

export function useText(options: TUseTextOptions): TUseTextResponse {
  const {
    textAlignVertical = 'BOTTOM',
    textAlignHorizontal = 'LEFT',
    angle,
    width,
    height,
    lineHeight = '1em',
    characters,
    style,
  } = options;

  const textDimensions = useTextDimensions(characters, style ?? {});

  const wordsByLines = React.useMemo<TWordsWithWidth[] | null>(() => {
    if (textDimensions.hasLoaded) {
      const { spaceWidth, lines } = textDimensions;
      const wordsByLines: TWordsWithWidth[] = [];

      for (const line of lines) {
        // Add new line
        wordsByLines.push({ words: [], width: 0 });

        // Add words to line and check its width,
        // if its width is too long add a new line
        for (const { word, width: wordWidth } of line) {
          const currentLine =
            wordsByLines.length > 0
              ? wordsByLines[wordsByLines.length - 1]
              : null;
          if (
            currentLine != null &&
            currentLine.width + wordWidth + spaceWidth < width
          ) {
            currentLine.words.push(word);
            currentLine.width = currentLine.width + wordWidth + spaceWidth;
          } else {
            const newLine = { words: [word], width: wordWidth };
            wordsByLines.push(newLine);
          }
        }
      }

      return wordsByLines;
    } else {
      return null;
    }
  }, [width, textDimensions]);

  const updatedStyle = React.useMemo<React.CSSProperties>(() => {
    const newStyle: React.CSSProperties = { ...style };
    const transforms: string[] = [];

    if (wordsByLines != null) {
      // Apply text alignment
      const { translate, textAnchor, dominantBaseline } = mapTextAlignment({
        textAlignHorizontal,
        textAlignVertical,
        width,
        height,
        lineHeight,
        linesCount: wordsByLines.length,
      });

      transforms.push(translate);
      newStyle.textAnchor = textAnchor as any;
      newStyle.dominantBaseline = dominantBaseline as any;
    }

    // Apply rotation
    if (angle) {
      transforms.push(`rotate(${angle})`);
    }

    newStyle.transform =
      transforms.length > 0 ? transforms.join(' ') : newStyle.transform;
    return newStyle;
  }, [style, width, height, lineHeight, wordsByLines, angle]);

  return wordsByLines != null && updatedStyle != null
    ? {
        hasLoaded: true,
        wordsByLines,
        style: updatedStyle,
      }
    : { hasLoaded: false };
}

type TUseTextOptions = {
  // Vertical text alignment
  textAlignVertical?: TTextNode['textAlignVertical'];
  // Horizontal text alignment
  textAlignHorizontal?: TTextNode['textAlignHorizontal'];
  // Rotation angle of the text
  angle?: number;
  // Width of text box
  width: number;
  // Height of text box
  height: number;
  // Desired "line height" of the text, implemented as y offsets
  lineHeight?: SVGTSpanProps['dy'];
  // Cap height of the text
  capHeight?: SVGTSpanProps['capHeight'];
  // String (or number coercible to one) to be styled and positioned
  characters: string | number;
  // Styles used in computation of its size
  style?: React.CSSProperties;
};

type TUseTextResponse =
  | {
      wordsByLines: TWordsWithWidth[];
      style: React.CSSProperties;
      hasLoaded: true;
    }
  | { hasLoaded: false };

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;

export type TWordsWithWidth = {
  words: string[];
  width: number;
};
