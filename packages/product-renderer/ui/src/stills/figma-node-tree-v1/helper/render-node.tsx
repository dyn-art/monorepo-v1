import { TNode } from '@pda/shared-types';
import { renderFrame } from './render-frame';
import { renderGroup } from './render-group';
import { renderRectangle } from './render-rectangle';
import { renderSVG } from './render-svg';
import { renderText } from './render-text';

export async function renderNode(node: TNode): Promise<JSX.Element | null> {
  switch (node.type) {
    case 'FRAME':
      return renderFrame(node);
    case 'RECTANGLE':
      return renderRectangle(node);
    case 'SVG':
      return renderSVG(node);
    case 'TEXT':
      return renderText(node);
    case 'GROUP':
      return renderGroup(node);
    default:
    // do nothing
  }
  return null;
}
