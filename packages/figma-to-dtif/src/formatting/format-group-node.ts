import { ENodeTypes, TGroupNode } from '@pda/dtif-types';
import { notEmpty } from '@pda/utils';
import { convert2DMatrixTo3DMatrix } from '../utils';
import { formatNode } from './format-node';
import { TFormatNodeConfig } from './format-node-to-dtif';

export async function formatGroupNode(
  node: GroupNode,
  options: TFormatNodeConfig
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
    children: (
      await Promise.all(
        node.children.map((node) => formatNode(node, options, false))
      )
    ).filter(notEmpty),
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
