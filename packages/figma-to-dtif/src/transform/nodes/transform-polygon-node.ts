import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TEffect, TPolygonNode, TVectorPath } from '@pda/types/dtif';

export async function transformPolygonNode(
  node: PolygonNode
): Promise<TPolygonNode> {
  return {
    type: 'POLYGON',
    pointCount: node.pointCount,
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
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as TEffect[],
    // Fill mixin
    fill: { paintIds: [] }, // Will be set by Composition class
  };
}
