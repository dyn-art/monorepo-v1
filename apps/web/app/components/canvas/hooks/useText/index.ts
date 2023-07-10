import { TTextNode } from '@pda/types/dtif';
import React, { SVGAttributes, useMemo } from 'react';
import { logger } from '../../../../core/logger';
import { useHydrated } from '../useHydrated';
import getStringWidth from './get-string-width';
import { mapTextAlignment } from './map-text-alignment';

export function useText(props: TUseTextOptions): TUseTextResponse {
  // Check whether component has been hydrated on the client side
  const isHydrated = useHydrated();
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
  const [isTextReady, setIsTextReady] = React.useState(false);
  const [loadedFontFamily, setLoadedFontFamily] = React.useState<string | null>(
    null
  );

  // Load font
  React.useEffect(() => {
    (async () => {
      if (isHydrated && style?.fontFamily != null) {
        const WebFont = (await import('webfontloader')).default;
        const fontFamily = `${style?.fontFamily}:${style?.fontWeight ?? 400}`;
        WebFont.load({
          google: {
            families: [fontFamily],
          },
        });
        setLoadedFontFamily(fontFamily);
      }
    })();
  }, [isHydrated, style?.fontFamily, style?.fontWeight]);

  const { wordsWithWidth, spaceWidth } = useMemo(() => {
    if (loadedFontFamily == null) {
      return { wordsWithWidth: [], spaceWidth: 0 };
    }

    // Split content
    const words: string[] =
      characters == null
        ? []
        : characters.toString().split(/(?:(?!\u00A0+)\s+)/);

    // Calculate word & space width
    const wordsWithWidth = words.map((word) => ({
      word,
      wordWidth: getStringWidth(word, style) ?? 0,
    }));
    const spaceWidth = getStringWidth('\u00A0', style) ?? 0;

    logger.info({ wordsWithWidth, spaceWidth });

    setIsTextReady(true);
    return {
      wordsWithWidth,
      spaceWidth,
    };
  }, [characters, style, loadedFontFamily]);

  // Arrange words in lines
  const wordsByLines = useMemo(() => {
    return wordsWithWidth.reduce(
      (result: WordsWithWidth[], { word, wordWidth }) => {
        const currentLine =
          result.length > 0 ? result[result.length - 1] : null;

        logger.info({
          word,
          wordWidth,
          spaceWidth,
          width,
          currentWidth: currentLine?.width + wordWidth + spaceWidth,
          currentLine,
        });

        // Word can be added to an existing line
        if (
          currentLine != null &&
          currentLine.width + wordWidth + spaceWidth < width
        ) {
          currentLine.words.push(word);
          currentLine.width = currentLine.width + wordWidth + spaceWidth;
        }
        // Add first word to line or word is too long to fit on existing line
        else {
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

  return { wordsByLines, style: updatedStyle, isTextReady };
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

type TUseTextResponse =
  | {
      wordsByLines: WordsWithWidth[];
      style: React.CSSProperties;
      isTextReady: true;
    }
  | { isTextReady: false };

export type WordsWithWidth = {
  words: string[];
  width: number;
};
