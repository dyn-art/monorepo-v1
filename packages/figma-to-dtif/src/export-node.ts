import { TTransform } from '@pda/dtif-types';
import { TFormatNodeOptions, formatNode } from './formatting';

export async function exportNode(node: SceneNode, options: TFormatNodeOptions) {
  // Format the node
  const toExportNode = await formatNode(node, options, true);

  // Reset top level position node properties
  return {
    ...toExportNode,
    x: 0,
    y: 0,
    rotation: 0,
    transform: toExportNode.transform.map((row) => [
      row[0],
      row[1],
      0,
    ]) as TTransform,
  };
}
