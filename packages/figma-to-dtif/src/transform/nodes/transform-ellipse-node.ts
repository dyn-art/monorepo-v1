import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TTransformNodeOptions } from '@/types';
import { TEffect, TEllipseNode, TVectorPath } from '@pda/types/dtif';

export async function transformEllipseNode(
  node: EllipseNode,
  options: TTransformNodeOptions
): Promise<TEllipseNode> {
  const { geometry = true } = options;

  return {
    type: 'ELLIPSE',
    arcData: {
      endingAngle: node.arcData.endingAngle,
      startingAngle: node.arcData.startingAngle,
      innerRadiusRatio: node.arcData.innerRadius,
    },
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
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as TEffect[],
    // Fill mixin
    fill: { paintIds: [] }, // Will be set by Composition class
  };
}
