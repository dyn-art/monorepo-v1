import { TTextNode } from '@pda/types/dtif';
import React from 'react';

export function textAlignmentToCSS(node: TTextNode): React.CSSProperties {
  let textAnchor = '';
  let transform = '';
  let dominantBaseline = '';

  // Handle horizontal text alignment
  switch (node.textAlignHorizontal) {
    case 'CENTER':
      textAnchor = 'middle';
      transform = `translate(${node.width / 2}px, `;
      break;
    case 'RIGHT':
      textAnchor = 'end';
      transform = `translate(${node.width}px, `;
      break;
    case 'JUSTIFIED':
      textAnchor = 'middle'; // SVG doesn't support justified text, so default to center
      transform = `translate(${node.width / 2}px, `;
      break;
    default:
      textAnchor = 'start';
      transform = `translate(0px, `;
      break;
  }

  // Handle vertical text alignment
  switch (node.textAlignVertical) {
    case 'CENTER':
      dominantBaseline = 'middle';
      transform += `${node.height / 2}px)`;
      break;
    case 'BOTTOM':
      dominantBaseline = 'text-after-edge';
      transform += `${node.height}px)`;
      break;
    default: // TOP
      dominantBaseline = 'text-before-edge';
      transform += `0px)`;
      break;
  }

  return {
    textAnchor: textAnchor as any,
    dominantBaseline: dominantBaseline as any,
    transform,
  };
}
