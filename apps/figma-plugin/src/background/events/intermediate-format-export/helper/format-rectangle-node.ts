import { TRectangleNode } from '@pda/shared-types';
import { handleFills } from './handle-fills';

export async function formatRectangleNode(
  node: RectangleNode
): Promise<TRectangleNode> {
  return {
    type: 'RECTANGLE',
    // BasNode mixin
    id: node.id,
    name: node.name,
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: node.relativeTransform,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
    // RectangleCorner mixin
    bottomLeftRadius: node.bottomLeftRadius,
    bottomRightRadius: node.bottomRightRadius,
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topRightRadius,
    // Fills mixin
    fills: await handleFills(node.fills as Paint[]),
  };
}
