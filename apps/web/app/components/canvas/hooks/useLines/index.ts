import { TTextNode } from '@pda/types/dtif';
import React from 'react';
import { TUseTextDimensionsResponse } from '../useTextDimensions';
import { applyTextAlignment } from './apply-text-alignment';
import { createNewLine } from './create-new-line';
import { updateLine } from './update-line';

export function useLines(options: TUseLinesOptions): TLine[] | null {
  const {
    textAlignVertical = 'BOTTOM',
    textAlignHorizontal = 'LEFT',
    width,
    height,
    lineHeight,
    textStyle,
    textDimensions,
  } = options;

  // Construct lines
  const linesWithoutPosition = React.useMemo<TLine[] | null>(() => {
    // Ensure textDimensions has loaded before processing.
    if (!textDimensions?.hasLoaded) {
      return null;
    }

    const { spaceWidth, lines } = textDimensions;
    const wordsByLines: TLine[] = [];

    let lineIndex = 0;
    for (const line of lines) {
      let currentLine: TLine | null = null;

      for (let i = 0; i < line.length; i++) {
        const { word, width: wordWidth, height: wordHeight } = line[i];
        const finalSpace = i === line.length - 1 ? 0 : spaceWidth;

        // If there's no current line or if word doesn't fit in the current line, create a new line
        if (
          currentLine == null ||
          currentLine.width + wordWidth + finalSpace > width
        ) {
          currentLine = createNewLine(word, wordWidth, wordHeight, lineIndex++);
          wordsByLines.push(currentLine);
        }
        // If the word fits in the current line, add it
        else {
          updateLine(
            currentLine,
            word,
            wordWidth,
            wordHeight,
            spaceWidth,
            i === line.length - 1
          );
        }
      }
    }

    return wordsByLines;
  }, [width, textDimensions]);

  // Apply text alignment
  const lines = React.useMemo<TLine[] | null>(() => {
    if (linesWithoutPosition != null && linesWithoutPosition.length > 0) {
      return applyTextAlignment({
        textAlignHorizontal,
        textAlignVertical,
        width,
        height,
        lineHeight,
        lines: linesWithoutPosition,
      });
    } else {
      return null;
    }
  }, [textStyle, width, height, lineHeight, linesWithoutPosition]);

  return lines;
}

type TUseLinesOptions = {
  width: number;
  height: number;
  textDimensions: TUseTextDimensionsResponse;
  textAlignVertical: TTextNode['textAlignVertical'];
  textAlignHorizontal: TTextNode['textAlignHorizontal'];
  lineHeight: number;
  textStyle: React.CSSProperties;
};

export type TLine = {
  words: string[];
  width: number;
  height: number;
  x: number | string;
  y: number | string;
  index: number;
};
