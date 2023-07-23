import { TComposition } from '@pda/types/dtif';
import { formatFrameNode } from '.';
import { logger } from '../logger';
import { TFormatNodeOptions } from '../types';
import { resetNodeTransform } from '../utils';

export async function formatFrameToComposition(
  node: FrameNode | ComponentNode | InstanceNode,
  options: Omit<TFormatNodeOptions, 'tempFrameNode'>
): Promise<TComposition> {
  logger.info('Format frame to Scene', { node, options });

  // Create temp context frame so in case of error
  // there are no random temporary nodes flying around in the scene
  const tempFrameNode = createTempFrameNode(
    'Temp container frame of PDA plugin | Delete if plugin not active'
  );

  // Format the node
  let formattedNode = await formatFrameNode(node, {
    tempFrameNode,
    ...options,
  });

  // Reset top level transform related node properties
  formattedNode = {
    ...formattedNode,
    relativeTransform: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  };

  // Remove temp frame
  tempFrameNode.remove();

  return {
    version: '1.0',
    name: `${formattedNode.name} Scene`,
    root: formattedNode,
    height: formattedNode.height,
    width: formattedNode.width,
  };
}

function createTempFrameNode(name: string) {
  const tempFrameNode = figma.createFrame();
  resetNodeTransform(tempFrameNode);
  tempFrameNode.name = name;
  tempFrameNode.resize(1, 1);
  tempFrameNode.clipsContent = false; // With clip content active figma would just export the visible piece in the frame
  return tempFrameNode;
}
