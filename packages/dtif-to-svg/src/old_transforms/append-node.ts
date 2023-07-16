import { TD3SVGElementSelection } from '@/types';
import { TNode } from '@pda/types/dtif';
import { appendFrameNode } from './append-frame-node';
import { appendRectangleNode } from './append-rectangle-node';

export async function appendNode(
  parent: TD3SVGElementSelection,
  props: { node: TNode; index?: number }
): Promise<TD3SVGElementSelection | null> {
  const { node, index = 0 } = props;
  switch (node.type) {
    case 'FRAME':
      return appendFrameNode(parent, { index, node });
    case 'RECTANGLE':
      return appendRectangleNode(parent, { index, node });
    default:
      return null;
  }
}
