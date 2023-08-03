import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TGroupNode } from '@pda/types/dtif';

export async function transformGroupNode(node: GroupNode): Promise<TGroupNode> {
  return {
    type: 'GROUP',
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
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
  };
}
