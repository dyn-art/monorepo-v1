import { TTextNode, TVector } from '@pda/types/dtif';
import React, { SVGAttributes } from 'react';
import { useTextDimensions } from '../useTextDimensions';
import { applyTextAlignment } from './apply-text-alignment';

export function useText(options: TUseTextOptions): TUseTextResponse {
  const {
    textAlignVertical = 'BOTTOM',
    textAlignHorizontal = 'LEFT',
    width,
    height,
    lineHeight,
    characters,
    textStyle,
  } = options;

  const textDimensions = useTextDimensions(characters, textStyle ?? {});

  const linesWithoutPosition = React.useMemo<TLine[] | null>(() => {
    if (textDimensions.hasLoaded) {
      const { spaceWidth, lines } = textDimensions;
      const wordsByLines: TLine[] = [];

      let lineIndex = 0;
      for (const line of lines) {
        let totalHeight = 0;

        // Add new line
        wordsByLines.push({
          words: [],
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          index: lineIndex++,
        });

        // Add words to line and check its width,
        for (let i = 0; i < line.length; i++) {
          const { word, width: wordWidth, height: wordHeight } = line[i];
          const currentLine =
            wordsByLines.length > 0
              ? wordsByLines[wordsByLines.length - 1]
              : null;
          const finalSpace = i === line.length - 1 ? 0 : spaceWidth;
          if (
            currentLine != null &&
            currentLine.width + wordWidth + finalSpace < width
          ) {
            currentLine.words.push(word);
            currentLine.width = currentLine.width + wordWidth + finalSpace;
            totalHeight += wordHeight;
            currentLine.height = totalHeight / currentLine.words.length;
          }
          // If its width is too long add a new line
          else {
            totalHeight = 0;
            wordsByLines.push({
              words: [word],
              width: wordWidth,
              height: wordHeight,
              x: 0,
              y: 0,
              index: lineIndex++,
            });
          }
        }
      }

      return wordsByLines;
    } else {
      return null;
    }
  }, [width, textDimensions]);

  const lines = React.useMemo<TLine[] | null>(() => {
    // Apply text alignment
    if (linesWithoutPosition != null && linesWithoutPosition.length > 0) {
      return applyTextAlignment({
        textAlignHorizontal,
        textAlignVertical,
        width,
        height,
        lineHeight: textStyle?.lineHeight,
        lines: linesWithoutPosition,
      });
    } else {
      return null;
    }
  }, [textStyle, width, height, lineHeight, linesWithoutPosition]);

  return lines != null
    ? {
        hasLoaded: true,
        lines,
      }
    : { hasLoaded: false };
}

type TUseTextOptions = {
  // Width of text box
  width: number;
  // Height of text box
  height: number;
  // Position of the text
  position: TVector;
  // String (or number coercible to one) to be styled and positioned
  characters: string | number;
  // Vertical text alignment
  textAlignVertical?: TTextNode['textAlignVertical'];
  // Horizontal text alignment
  textAlignHorizontal?: TTextNode['textAlignHorizontal'];
  // Desired "line height" of the text, implemented as y offsets
  lineHeight?: SVGTSpanProps['dy'];
  // Styles used in computation of its size
  textStyle?: React.CSSProperties;
};

type TUseTextResponse =
  | {
      lines: TLine[];
      hasLoaded: true;
    }
  | { hasLoaded: false };

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;

export type TLine = {
  words: string[];
  width: number;
  height: number;
  x: number | string;
  y: number | string;
  index: number;
};
