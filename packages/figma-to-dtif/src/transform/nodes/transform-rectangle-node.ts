import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TEffect, TRectangleNode, TVectorPath } from '@pda/types/dtif';

export async function transformRectangleNode(
  node: RectangleNode
): Promise<TRectangleNode> {
  return {
    type: 'RECTANGLE',
    // Base node mixin
    id: node.id,
    name: node.name,
    // Scene node mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Constraints mixin
    constraints: node.constraints,
    // Geometry mixin
    fillGeometry: node.fillGeometry as TVectorPath[],
    strokeGeometry: node.strokeGeometry as TVectorPath[],
    // Rectangle corner mixin
    bottomLeftRadius: node.bottomLeftRadius,
    bottomRightRadius: node.bottomRightRadius,
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topRightRadius,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as TEffect[],
    // Fills mixin
    fills: [] as string[], // Will be set by Composition class
  };
}
