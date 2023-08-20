import { TComposition, TNode } from '@pda/types/dtif';
import { Composition } from '../Composition';
import { CompositionNode, D3Node, Frame, Rectangle, Text } from '../nodes';

export async function appendNode(
  parent: D3Node,
  props: {
    id: string;
    node: TNode;
    composition: Composition;
    dtifComposition: TComposition;
  }
): Promise<CompositionNode | null> {
  const { id, node, composition, dtifComposition } = props;
  switch (node.type) {
    case 'FRAME':
      return new Frame(id, node, composition).init(parent, dtifComposition);
    case 'RECTANGLE':
      return new Rectangle(id, node, composition).init(parent, dtifComposition);
    case 'TEXT':
      try {
        return new Text(id, node, composition).init(parent, dtifComposition);
      } catch (e) {
        // TODO: Return static text node if e.g. typeface couldn't be loaded
        return null;
      }
    default:
      return null;
  }
}
