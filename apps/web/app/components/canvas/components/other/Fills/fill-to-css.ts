import { TNode, TPaint } from '@pda/types/dtif';
import React from 'react';
import { handleSolidFill } from './handle-solid-fill';

export function fillToCSS(fill: TPaint, node: TNode): React.CSSProperties {
  let fillStyle: React.CSSProperties = {};

  // Handle different fill types
  switch (fill.type) {
    case 'SOLID':
      fillStyle = handleSolidFill(fill);
      break;
    default:
    // do nothing
  }

  return {
    ...fillStyle,
    opacity: fill.opacity ?? 1,
  };
}
