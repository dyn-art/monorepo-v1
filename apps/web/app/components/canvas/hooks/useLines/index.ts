import { TTextNode } from '@pda/types/dtif';
import React from 'react';
import { TUseTextDimensionsResponse } from '../useTextDimensions';
import { applyTextAlignment } from './apply-text-alignment';
import { constructLines } from './construct-lines';

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

    return constructLines({
      spaceWidth: textDimensions.spaceWidth,
      lines: textDimensions.lines,
      width,
    });
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
