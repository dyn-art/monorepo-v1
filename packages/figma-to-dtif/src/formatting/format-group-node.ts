import { ENodeTypes, TGroupNode } from '@pda/dtif-types';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { convert2DMatrixTo3DMatrix } from '../helper';
import { formatNode } from './format-node';

export async function formatGroupNode(
  node: GroupNode,
  options: TFormatNodeConfig
): Promise<TGroupNode> {
  return {
    type: ENodeTypes.GROUP,
    // BaseNode mixin
    id: node.id,
    name: node.name,
    // Children mixin
    children: await Promise.all(
      node.children.map((node) => formatNode(node, options, false))
    ),
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects as Effect[],
  };
}
