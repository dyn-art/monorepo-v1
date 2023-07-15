import { TNode } from '@pda/types/dtif';
import { TD3SVGElementSelection } from '../types';
import { Scene } from './Scene';
import { Node, Rectangle } from './nodes';
import { Frame } from './nodes/Frame';

export async function appendNode(
  parent: TD3SVGElementSelection,
  props: { node: TNode; scene: Scene }
): Promise<Node | null> {
  const { node, scene } = props;
  switch (node.type) {
    case 'FRAME':
      return new Frame(parent, node, scene).init();
    case 'RECTANGLE':
      return new Rectangle(parent, node, scene).init();
    default:
      return null;
  }
}
