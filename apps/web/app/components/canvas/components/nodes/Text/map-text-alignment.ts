import { TTextNode } from '@pda/types/dtif';

export function mapTextAlignment(props: {
  textAlignHorizontal: TTextNode['textAlignHorizontal'];
  textAlignVertical: TTextNode['textAlignVertical'];
  width: number;
  height: number;
}): {
  textAnchor: string;
  translate: string;
  dominantBaseline: string;
} {
  const { textAlignHorizontal, textAlignVertical, width, height } = props;

  let textAnchor = '';
  let translate = '';
  let dominantBaseline = '';

  // Handle horizontal text alignment
  switch (textAlignHorizontal) {
    case 'CENTER':
      textAnchor = 'middle';
      translate = `translate(${width / 2}px, `;
      break;
    case 'RIGHT':
      textAnchor = 'end';
      translate = `translate(${width}px, `;
      break;
    case 'JUSTIFIED':
      textAnchor = 'middle'; // SVG doesn't support justified text, so default to center
      translate = `translate(${width / 2}px, `;
      break;
    default:
      textAnchor = 'start';
      translate = `translate(0px, `;
      break;
  }

  // Handle vertical text alignment
  switch (textAlignVertical) {
    case 'CENTER':
      dominantBaseline = 'middle';
      translate += `${height / 2}px)`;
      break;
    case 'BOTTOM':
      dominantBaseline = 'text-after-edge';
      translate += `${height}px)`;
      break;
    default: // TOP
      dominantBaseline = 'text-before-edge';
      translate += `0px)`;
      break;
  }

  return {
    textAnchor,
    dominantBaseline,
    translate,
  };
}
