import { TD3SVGElementSelection } from '@/types';
import { TNode } from '@pda/types/dtif';
import { appendRectangleNode } from './append-rectangle-node';

export async function appendNode(
  parent: TD3SVGElementSelection,
  props: { node: TNode; index?: number }
): Promise<TD3SVGElementSelection | null> {
  const { node, index = 0 } = props;

  switch (node.type) {
    case 'RECTANGLE':
      return appendRectangleNode(parent, { index, node });
    default:
      return null;
  }
}
