import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TTransformNodeOptions } from '@/types';
import { TEffect, TRectangleNode, TVectorPath } from '@pda/types/dtif';

export async function transformRectangleNode(
  node: RectangleNode,
  options: TTransformNodeOptions
): Promise<TRectangleNode> {
  const { geometry = true } = options;

  return {
    type: 'RECTANGLE',
    // Base node mixin
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
    geometry: geometry
      ? {
          fill: node.fillGeometry as TVectorPath[],
          stroke: node.strokeGeometry as TVectorPath[],
        }
      : undefined,
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
    // Fill mixin
    fill: { paintIds: [] }, // Will be set by Composition class
  };
}
