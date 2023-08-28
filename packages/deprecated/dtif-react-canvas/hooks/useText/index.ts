import { TTextNode } from '@dyn/types/dtif';
import React from 'react';
import { TLine, useLines } from '../useLines';
import { useTextDimensions } from '../useTextDimensions';

export function useText(options: TUseTextOptions): TUseTextResponse {
  const {
    textAlignVertical = 'BOTTOM',
    textAlignHorizontal = 'LEFT',
    width,
    height,
    lineHeight,
    characters,
    textStyle = {},
  } = options;

  const textDimensions = useTextDimensions(characters, textStyle ?? {});
  const lines = useLines({
    textDimensions,
    height,
    width,
    textAlignHorizontal,
    textAlignVertical,
    textStyle,
    lineHeight,
  });

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
  // String (or number coercible to one) to be styled and positioned
  characters: string | number;
  // Line height of the text, implemented as y offsets
  lineHeight: number;
  // Vertical text alignment
  textAlignVertical?: TTextNode['textAlignVertical'];
  // Horizontal text alignment
  textAlignHorizontal?: TTextNode['textAlignHorizontal'];
  // Styles used in computation of its size
  textStyle?: React.CSSProperties;
};

type TUseTextResponse =
  | {
      lines: TLine[];
      hasLoaded: true;
    }
  | { hasLoaded: false };
