import { TEffect, TRectangleNode } from '@pda/types/dtif';
import { TFormatNodeOptions } from '../types';
import { convert2DMatrixTo3DMatrix } from '../utils';
import { formatFills } from './format-fills';

export async function formatRectangleNode(
  node: RectangleNode,
  options: TFormatNodeOptions
): Promise<TRectangleNode> {
  return {
    type: 'RECTANGLE',
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
    fills: await formatFills(node, node.fills as Paint[], options),
  };
}
