import { ENodeTypes, TFrameNode } from '@pda/dtif-types';
import { notEmpty } from '@pda/utils';
import { convert2DMatrixTo3DMatrix, handleFills } from '../utils';
import { formatNode } from './format-node';
import { TFormatNodeConfig } from './format-root';

export async function formatFrameNode(
  node: FrameNode | ComponentNode | InstanceNode,
  options: TFormatNodeConfig
): Promise<TFrameNode> {
  return {
    type: ENodeTypes.FRAME,
    clipsContent: node.clipsContent,
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
    effects: node.effects,
    // RectangleCorner mixin
    bottomLeftRadius: node.bottomLeftRadius,
    bottomRightRadius: node.bottomRightRadius,
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topRightRadius,
    // Fills mixin
    fills: await handleFills(node, node.fills as Paint[], options),
  } as TFrameNode;
}
