import { appendAttributes } from '@/helpers/d3';
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

  // Create element
  const element = parent.append('g');
  appendAttributes(element, {
    id: getElementId({ id: node.id, type: 'fill' }),
    clipPath: `url(#${clipPathId})`,
  });

  // Append fills  element
  node.fills.map((fill, i) => {
    switch (fill.type) {
      case 'SOLID':
        appendSolidFill(element, { node, paint: fill, index: i });
        return;
      default:
      // do nothing
    }
  });

  return element;
}
