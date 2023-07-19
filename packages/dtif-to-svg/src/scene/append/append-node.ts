import { TNode } from '@pda/types/dtif';
import { Scene } from '../Scene';
import { D3Node, Frame, Node, Rectangle } from '../nodes';

export async function appendNode(
  parent: D3Node,
  props: { node: TNode; scene: Scene }
): Promise<Node | null> {
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
