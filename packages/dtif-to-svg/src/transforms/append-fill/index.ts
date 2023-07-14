import { getElementId, hasFill } from '@/helpers/other';
import { TD3SVGElementSelection } from '@/types';
import { TNode } from '@pda/types/dtif';
import { appendSolidFill } from './append-solid-fill';

export async function appendFill(
  parent: TD3SVGElementSelection,
  props: { node: TNode; clipPathId: string }
) {
  const { node, clipPathId } = props;
  if (!hasFill(node)) {
    return null;
  }

  // Create wrapper g element
  const gElement = parent
    .append('g')
    .attr('id', getElementId({ id: node.id, type: 'fill' }))
    .attr('clip-path', `url(#${clipPathId})`);

  // Append fills to wrapper g element
  node.fills.map((fill, i) => {
    switch (fill.type) {
      case 'SOLID':
        appendSolidFill(gElement, { node, paint: fill, index: i });
        return;
      default:
      // do nothing
    }
  });

  return gElement;
}
