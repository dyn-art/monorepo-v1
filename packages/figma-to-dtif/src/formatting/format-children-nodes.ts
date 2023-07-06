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
      children.map((node) => {
        try {
          return formatNode(node, options, false);
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
