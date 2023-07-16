import { hasFill } from '@/helpers/other';
import { TNode } from '@pda/types/dtif';
import { D3Node } from '../../nodes';
import { appendSolidFill } from './append-solid-fill';

export async function appendFill(
  parent: D3Node,
  props: { node: TNode; clipPathId: string; id: string }
) {
  const { node, clipPathId, id } = props;
  if (!hasFill(node)) {
    return null;
  }

  // Create element
  const fillWrapperNode = parent.append('g', {
    id,
    attributes: {
      clipPath: `url(#${clipPathId})`,
    },
  });

  // Append fills  element
  node.fills.map((paint, i) => {
    switch (paint.type) {
      case 'SOLID':
        appendSolidFill(fillWrapperNode, { node, paint: paint, index: i });
        break;
      default:
      // do nothing
    }
  });

  return fillWrapperNode;
}
