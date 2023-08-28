import { TTextNode } from '@dyn/types/dtif';
import { TLine } from '.';

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
  const totalTextHeight = lines[0].height + lineHeight * (lines.length - 1);

  let startX = 0;
  let startY = 0;

  // Determine horizontal text alignment start position
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

  // Determine vertical text alignment start position
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

  // Determine offset created by text dimensions
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
