import { TComposition, TNode } from '@pda/types/dtif';
import { Composition } from '../Composition';
import { CompositionNode, D3Node, Frame, Rectangle } from '../nodes';

export async function appendNode(
  parent: D3Node,
  props: {
    node: TNode;
    composition: Composition;
    dtifComposition: TComposition;
  }
): Promise<CompositionNode | null> {
  const { node, composition, dtifComposition } = props;
  switch (node.type) {
    case 'FRAME':
      return new Frame(node, composition).init(parent, dtifComposition);
    case 'RECTANGLE':
      return new Rectangle(node, composition).init(parent, dtifComposition);
    default:
      return null;
  }
}
