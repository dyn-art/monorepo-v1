import { TTextNode } from '@pda/types/dtif';
import { TLine } from '.';
import { logger } from '../../../../core/logger';

export function applyTextAlignment(props: {
  textAlignHorizontal: TTextNode['textAlignHorizontal'];
  textAlignVertical: TTextNode['textAlignVertical'];
  width: number;
  height: number;
  lineHeight: number;
  lines: TLine[];
}): TLine[] {
  const {
    textAlignHorizontal,
    textAlignVertical,
    width,
    height,
    lineHeight,
    lines,
  } = props;
  const totalTextHeight = lineHeight * lines.length;
  let startX = 0;
  let startY = 0;

  // TODO: REMOVE
  logger.info(
    lines.reduce((chars, current) => (chars += current.words.join(' ')), ''),
    { props }
  );

  // Handle horizontal text alignment
  switch (textAlignHorizontal) {
    case 'CENTER':
      startX = width / 2;
      break;
    case 'RIGHT':
      startX = width;
      break;
    case 'JUSTIFIED':
    case 'LEFT':
    default:
      startX = 0;
      break;
  }

  // Handle vertical text alignment
  switch (textAlignVertical) {
    case 'CENTER':
      startY = (height - totalTextHeight) / 2 + totalTextHeight;
      break;
    case 'BOTTOM':
      startY = height;
      break;
    case 'TOP':
    default:
      startY = totalTextHeight;
      break;
  }

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    let offset = 0;

    switch (textAlignHorizontal) {
      case 'CENTER':
        offset = line.width / 2;
        break;
      case 'RIGHT':
        offset = line.width;
        break;
      case 'JUSTIFIED':
      case 'LEFT':
      default:
        offset = 0;
        break;
    }

    line.x = startX - offset;
    line.y = startY - lineHeight * (lines.length - 1 - i);
  }

  return lines;
}
