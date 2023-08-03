import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TFrameNode } from '@pda/types/dtif';

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
    children: [] as string[], // Will be set by Composition class
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Constraints mixin
    constraints: node.constraints,
    // Geometry mixin
    fillGeometry: node.fillGeometry,
    strokeGeometry: node.strokeGeometry,
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
    effects: node.effects,
    // Fills mixin
    fills: [] as string[], // Will be set by Composition class
  } as TFrameNode;
}
