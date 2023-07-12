import { TNode } from '@pda/types/dtif';
import { notEmpty } from '@pda/utils';
import { formatNode } from '.';
import { InvisibleNodeException } from '../exceptions';
import { TFormatNodeOptions } from '../types';

export async function formatChildrenNodes(
  children: SceneNode[],
  options: TFormatNodeOptions
): Promise<TNode[]> {
  return (
    await Promise.all(
      children.map(async (node) => {
        try {
          const formattedNode = await formatNode(node, options);
          return formattedNode;
        } catch (error) {
          if (error instanceof InvisibleNodeException) {
            return null;
          } else {
            throw error;
          }
        }
      })
    )
  ).filter(notEmpty);
}
