import { TNode } from '@pda/types/dtif';
import { Composition } from '../Composition';
import { CompositionNode, D3Node, Frame, Rectangle } from '../nodes';

export async function appendNode(
  parent: D3Node,
  props: { node: TNode; scene: Composition }
): Promise<CompositionNode | null> {
  const { node, scene } = props;
  switch (node.type) {
    case 'FRAME':
      return new Frame(node, scene).init(parent);
    case 'RECTANGLE':
      return new Rectangle(node, scene).init(parent);
    default:
      return null;
  }
}
