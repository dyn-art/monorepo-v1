import { TTextNode } from '@pda/types/dtif';
import { SVGAttributes } from 'react';
import { TLine } from '.';
import { logger } from '../../../../core/logger';

export function applyTextAlignment(props: {
  textAlignHorizontal: TTextNode['textAlignHorizontal'];
  textAlignVertical: TTextNode['textAlignVertical'];
  width: number;
  height: number;
  lineHeight: SVGAttributes<SVGTSpanElement>['dy'];
  lines: TLine[];
}): TLine[] {
  logger.info({ props });
  const {
    textAlignHorizontal,
    textAlignVertical,
    width,
    height,
    lineHeight,
    lines,
  } = props;

  let x = '0px';
  let y = '0px';

  // Handle horizontal text alignment
  switch (textAlignHorizontal) {
    case 'CENTER':
      x = '1px';
      y = '1px';
      // TODO:
      break;
    case 'RIGHT':
      // TODO:
      break;
    case 'JUSTIFIED':
      // TODO:
      break;
    case 'LEFT':
      // TODO:
      break;
    default:
    // TODO:
  }

  // Handle vertical text alignment
  switch (textAlignVertical) {
    case 'CENTER':
      // TODO:
      break;
    case 'BOTTOM':
      // TODO:
      break;
    case 'TOP':
      // TODO:
      break;
    default:
      // TODO:
      break;
  }

  return lines;
}
