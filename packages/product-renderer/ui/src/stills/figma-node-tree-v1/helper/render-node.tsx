import { TNode } from '@pda/shared-types';
import { renderFrame } from './render-frame';
import { renderGroup } from './render-group';
import { renderRectangle } from './render-rectangle';
import { renderSVG } from './render-svg';
import { renderText } from './render-text';

export async function renderNode(node: TNode): Promise<JSX.Element | null> {
  switch (node.type) {
    case 'FRAME':
      return await renderFrame(node);
    case 'RECTANGLE':
      return await renderRectangle(node);
    case 'SVG':
      return await renderSVG(node);
    case 'TEXT':
      return await renderText(node);
    case 'GROUP':
      return await renderGroup(node);
    default:
    // do nothing
  }
  return null;
}
