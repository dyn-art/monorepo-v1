import { TTextNode } from '@pda/types/dtif';
import { SVGAttributes } from 'react';
import reduceCSSCalc from 'reduce-css-calc';
import { logger } from '../../../../core/logger';

// TODO also get line height or lets say the dy
// also when its auto get the line height
// and then calculate center and top by my self lul
// because dominantBaseline is crap
// techAnchor is ok
export function mapTextAlignment(props: {
  textAlignHorizontal: TTextNode['textAlignHorizontal'];
  textAlignVertical: TTextNode['textAlignVertical'];
  width: number;
  height: number;
  lineHeight: SVGAttributes<SVGTSpanElement>['dy'];
  tSpanHeight: SVGAttributes<SVGTSpanElement>['dy'];
  linesCount: number;
}): {
  textAnchor: string;
  translate: string;
  dominantBaseline: string;
} {
  logger.info({ props });
  const {
    textAlignHorizontal,
    textAlignVertical,
    width,
    height,
    linesCount,
    lineHeight,
    tSpanHeight,
  } = props;
  const totalTextHeight = `(${lineHeight} * ${linesCount})`;

  let textAnchor = '';
  let dominantBaseline = '';

  let translateX = '0px';
  let translateY = '0px';

  // Handle horizontal text alignment
  switch (textAlignHorizontal) {
    case 'CENTER':
      textAnchor = 'middle';
      translateX = reduceCSSCalc(`calc(${width}px / 2)`);
      break;
    case 'RIGHT':
      textAnchor = 'end';
      translateX = `${width}px`;
      break;
    case 'JUSTIFIED':
      textAnchor = 'middle'; // SVG doesn't support justified text, so default to center
      translateX = reduceCSSCalc(`calc(${width}px / 2)`);
      break;
    case 'LEFT':
      textAnchor = 'start';
      translateX = '0px';
    default:
      textAnchor = 'start';
      translateX = '0px';
      break;
  }

  // Handle vertical text alignment
  switch (textAlignVertical) {
    case 'CENTER':
      dominantBaseline = 'ideographic';
      translateY = reduceCSSCalc(
        `calc((${height}px - ${totalTextHeight}) / 2)`
      );
      break;
    case 'BOTTOM':
      dominantBaseline = 'ideographic';
      translateY = reduceCSSCalc(`calc(${height}px - ${totalTextHeight})`);
      break;
    case 'TOP':
      dominantBaseline = 'ideographic';
      translateY = '0px';
      break;
    default:
      dominantBaseline = 'text-before-edge';
      translateY = '0px';
      break;
  }

  logger.info({ props, translateY, totalTextHeight });

  return {
    textAnchor,
    dominantBaseline,
    translate: `translate(${translateX}, ${translateY})`,
  };
}
