import { TTextNode } from '@pda/types/dtif';
import { WordsWithWidth, getStringWidth } from '@visx/text';
import React, { SVGAttributes, useMemo } from 'react';
import { mapTextAlignment } from './map-text-alignment';

export function useText(props: TUseTextOptions): TUseTextResponse {
  const {
    textAlignVertical = 'BOTTOM',
    textAlignHorizontal = 'LEFT',
    angle,
    width,
    height,
    lineHeight = '1em',
    characters,
    style,
  } = props;

  const { wordsWithWidth, spaceWidth } = useMemo(() => {
    // Split content
    const words: string[] =
      characters == null
        ? []
        : characters.toString().split(/(?:(?!\u00A0+)\s+)/);

    return {
      wordsWithWidth: words.map((word) => ({
        word,
        wordWidth: getStringWidth(word, style) || 0,
      })),
      spaceWidth: getStringWidth('\u00A0', style) || 0,
    };
  }, [characters, style]);

  // Arrange words in lines
  const wordsByLines = useMemo(() => {
    return wordsWithWidth.reduce(
      (result: WordsWithWidth[], { word, wordWidth }) => {
        const currentLine = result[result.length - 1];

        if (
          currentLine &&
          (currentLine.width || 0) + wordWidth + spaceWidth < width
        ) {
          // Word can be added to an existing line
          currentLine.words.push(word);
          currentLine.width = currentLine.width || 0;
          currentLine.width += wordWidth + spaceWidth;
        } else {
          // Add first word to line or word is too long to scaleToFit on existing line
          const newLine = { words: [word], width: wordWidth };
          result.push(newLine);
        }

        return result;
      },
      []
    );
  }, [width, wordsWithWidth, spaceWidth]);

  // Calculate updated styles
  const updatedStyle = useMemo<React.CSSProperties>(() => {
    const newStyle: React.CSSProperties = { ...style };

    const transforms: string[] = [];

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

    // Apply angle
    if (angle) {
      transforms.push(`rotate(${angle})`);
    }

    newStyle.transform =
      transforms.length > 0 ? transforms.join(' ') : newStyle.transform;

    return newStyle;
  }, [width, wordsByLines, angle]);

  return { wordsByLines, style: updatedStyle };
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

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;

type TUseTextResponse = {
  wordsByLines: WordsWithWidth[];
  style: React.CSSProperties;
};
