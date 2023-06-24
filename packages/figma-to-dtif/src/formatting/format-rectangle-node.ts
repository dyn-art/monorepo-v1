import { ENodeTypes, TEffect, TRectangleNode } from '@pda/dtif-types';
import { convert2DMatrixTo3DMatrix, handleFills } from '../utils';
import { TFormatNodeConfig } from './format-root';

export async function formatRectangleNode(
  node: RectangleNode,
  config: TFormatNodeConfig
): Promise<TRectangleNode> {
  return {
    type: ENodeTypes.RECTANGLE,
    // BasNode mixin
    id: node.id,
    name: node.name,
    // SceneNode mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
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
