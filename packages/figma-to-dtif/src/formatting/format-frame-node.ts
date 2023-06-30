import { ENodeTypes, TFrameNode } from '@pda/dtif-types';
import { TFormatNodeOptions } from '../types';
import { convert2DMatrixTo3DMatrix } from '../utils';
import { formatChildrenNodes } from './format-children-nodes';
import { formatFills } from './format-fills';

export async function formatFrameNode(
  node: FrameNode | ComponentNode | InstanceNode,
  options: TFormatNodeOptions
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
    children: await formatChildrenNodes(node.children as SceneNode[], options),
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
    fills: await formatFills(node, node.fills as Paint[], options),
  } as TFrameNode;
}
