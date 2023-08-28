import { TNode } from '@dyn/types/dtif';
import React from 'react';
import { TInherit } from '../types';
import { renderFrame } from './render-frame';
import { renderGroup } from './render-group';
import { renderRectangle } from './render-rectangle';
import { renderSVG } from './render-svg';
import { renderText } from './render-text';

export async function renderNode(
  node: TNode,
  inherit: TInherit,
  style: React.CSSProperties = {}
): Promise<React.ReactNode | null> {
  switch (node.type) {
    case 'FRAME':
      return await renderFrame(node, inherit, style);
    case 'RECTANGLE':
      return await renderRectangle(node, inherit, style);
    case 'SVG':
      return await renderSVG(node, inherit, style);
    case 'TEXT':
      return await renderText(node, inherit, style);
    case 'GROUP':
      return await renderGroup(node, inherit, style);
    default:
    // do nothing
  }
  return null;
}
