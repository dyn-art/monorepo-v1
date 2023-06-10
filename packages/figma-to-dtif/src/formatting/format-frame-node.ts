import { ENodeTypes, TFrameNode } from '@pda/dtif-types';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { convert2DMatrixTo3DMatrix } from '../helper';
import { handleFills } from '../helper/handle-fills';
import { formatNode } from './format-node';

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
