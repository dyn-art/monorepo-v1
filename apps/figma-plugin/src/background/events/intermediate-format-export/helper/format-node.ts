import { ESupportedFigmaNodeTypes, TNode } from '@pda/shared-types';
import { TIntermediateFormatExportEvent, logger } from '../../../../shared';
import { formatFrameNode } from './format-frame-node';
import { formatGroupNode } from './format-group-node';
import { formatRectangleNode } from './format-rectangle-node';
import { formatTextNode } from './format-text-node';
import { formatToSvgNode } from './format-to-svg-node';

export async function formatNode(
  node: SceneNode,
  config: TIntermediateFormatExportEvent['args']['config'],
  parent = false
): Promise<TNode | null> {
  if (node == null) {
    return null;
  }

  // Handle special svg formatting
  if (
    (node.name.match(config.svgExportIdentifier) ||
      config.frameToSVG ||
      parent) &&
    Object.values(ESupportedFigmaNodeTypes).includes(node.type as any)
  ) {
    return formatToSvgNode(node as any);
  }

  // Handle supported node formatting
  switch (node.type) {
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      return formatFrameNode(node, config);
    case 'GROUP':
      return formatGroupNode(node, config);
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

      logger.warn(
        `Node '${node.name}' of type '${node.type}' is not supported.`
      );
      return null;
  }
}
