import { TNode } from '../../../../shared/types/intermediate-format';
import { formatFrameNode } from './format-frame-node';
import { formatGroupNode } from './format-group-node';
import { formatMiscellaneousNodes } from './format-miscellaneous-node';
import { formatRectangleNode } from './format-rectangle-node';
import { formatTextNode } from './format-text-node';

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
      return formatMiscellaneousNodes(node);
    default:
      // do nothing

      return null;
  }
}
