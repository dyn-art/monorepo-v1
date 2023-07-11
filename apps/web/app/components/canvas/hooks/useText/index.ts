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
    lineHeight,
    characters,
    style,
  } = options;

  const textDimensions = useTextDimensions(characters, style ?? {});

  const wordsByLines = React.useMemo<TLine[] | null>(() => {
    if (textDimensions.hasLoaded) {
      const { spaceWidth, lines } = textDimensions;
      const wordsByLines: TLine[] = [];

      for (const line of lines) {
        let totalHeight = 0;

        // Add new line
        wordsByLines.push({ words: [], width: 0, height: 0 });

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
            });
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

    if (wordsByLines != null && wordsByLines.length > 0) {
      const tSpanHeight = `${wordsByLines.reduce(
        (sum, current, _, { length }) => sum + current.height / length,
        0
      )}px`;

      // Apply text alignment
      const { translate, textAnchor, dominantBaseline } = mapTextAlignment({
        textAlignHorizontal,
        textAlignVertical,
        width,
        height,
        lineHeight: style?.lineHeight ?? tSpanHeight,
        tSpanHeight,
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
      wordsByLines: TLine[];
      style: React.CSSProperties;
      hasLoaded: true;
    }
  | { hasLoaded: false };

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;

export type TLine = {
  words: string[];
  width: number;
  height: number;
};
