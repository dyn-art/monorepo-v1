import { TNode } from '@pda/shared-types';
import { formatFrameNode } from './format-frame-node';
import { formatGroupNode } from './format-group-node';
import { formatRectangleNode } from './format-rectangle-node';
import { formatTextNode } from './format-text-node';
import { formatToSvgNode } from './format-to-svg-node';

export async function formatNode(node: SceneNode): Promise<TNode | null> {
  if (node == null) {
    return null;
  }

  switch (node.type) {
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      return formatFrameNode(node);
    case 'GROUP':
      return formatGroupNode(node);
    case 'TEXT':
      return formatTextNode(node);
    case 'RECTANGLE':
      return formatRectangleNode(node);
    case 'LINE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'BOOLEAN_OPERATION':
      return formatToSvgNode(node);
    default:
      // do nothing

      return null;
  }
}
