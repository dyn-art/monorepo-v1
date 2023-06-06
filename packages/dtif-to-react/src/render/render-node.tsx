import { TNode } from '@pda/dtif-types';
import React from 'react';
import { renderFrame } from './render-frame';
import { renderGroup } from './render-group';
import { renderRectangle } from './render-rectangle';
import { renderSVG } from './render-svg';
import { renderText } from './render-text';

export async function renderNode(
  node: TNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode | null> {
  switch (node.type) {
    case 'FRAME':
      return await renderFrame(node, style);
    case 'RECTANGLE':
      return await renderRectangle(node, style);
    case 'SVG':
      return await renderSVG(node, style);
    case 'TEXT':
      return await renderText(node, style);
    case 'GROUP':
      return await renderGroup(node, style);
    default:
    // do nothing
  }
  return null;
}
