import { TFrameNode, TScene } from '@pda/dtif-types';
import { formatNode } from '.';
import { TFormatNodeOptions } from '../types';

export async function formatFrameToScene(
  node: FrameNode | ComponentNode | InstanceNode,
  options: TFormatNodeOptions
): Promise<TScene> {
  // Format the node
  let formattedNode = (await formatNode(node, options, true)) as TFrameNode;

  // Reset top level transform related node properties
  formattedNode = {
    ...formattedNode,
    relativeTransform: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  };

  return {
    version: '1.0',
    name: `${formattedNode.name} Scene`,
    root: formattedNode,
    height: formattedNode.height,
    width: formattedNode.width,
  };
}
