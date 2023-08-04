import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TEffect, TFrameNode, TVectorPath } from '@pda/types/dtif';

export async function transformFrameNode(
  node: FrameNode | ComponentNode | InstanceNode
): Promise<TFrameNode> {
  return {
    type: 'FRAME',
    clipsContent: node.clipsContent,
    // Base node mixin
    id: node.id,
    name: node.name,
    // Scene node mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Children mixin
    childIds: [], // Will be set by Composition class
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
    // Effect mixin
    effects: node.effects as TEffect[],
    // Fill mixin
    fill: { paintIds: [] }, // Will be set by Composition class
  };
}
