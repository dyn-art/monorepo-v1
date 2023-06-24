import { ENodeTypes, TGroupNode } from '@pda/dtif-types';
import { convert2DMatrixTo3DMatrix, processChildren } from '../utils';
import { TFormatNodeOptions } from './format-frame-to-scene';

export async function formatGroupNode(
  node: GroupNode,
  options: TFormatNodeOptions
): Promise<TGroupNode> {
  return {
    type: ENodeTypes.GROUP,
    // BaseNode mixin
    id: node.id,
    name: node.name,
    // SceneNode mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Children mixin
    children: await processChildren(node.children as SceneNode[], options),
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as Effect[],
  };
}
