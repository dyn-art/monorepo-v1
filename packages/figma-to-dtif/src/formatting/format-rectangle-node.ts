import { ENodeTypes, TEffect, TRectangleNode } from '@pda/dtif-types';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { convert2DMatrixTo3DMatrix, handleFills } from '../helper';

export async function formatRectangleNode(
  node: RectangleNode,
  config: TFormatNodeConfig
): Promise<TRectangleNode> {
  return {
    type: ENodeTypes.RECTANGLE,
    // BasNode mixin
    id: node.id,
    name: node.name,
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as TEffect[],
    // RectangleCorner mixin
    bottomLeftRadius: node.bottomLeftRadius,
    bottomRightRadius: node.bottomRightRadius,
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topRightRadius,
    // Fills mixin
    fills: await handleFills(node, node.fills as Paint[], config),
  };
}
