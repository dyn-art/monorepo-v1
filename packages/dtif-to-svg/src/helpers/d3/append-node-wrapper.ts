import { TD3SVGElementSelection } from '@/types';
import { TNode } from '@pda/types/dtif';
import { transformToCSS } from '../css/transform-to-css';
import { getElementId } from '../other/get-element-id';
import { appendAttributes } from './append-attributes';
import { appendCSS } from './append-css';

export function appendNodeWrapper(
  parent: TD3SVGElementSelection,
  props: { node: TNode; index?: number }
) {
  const { node, index = 0 } = props;

  // Create element
  const element = parent.append('g');
  appendAttributes(element, {
    id: getElementId({
      id: node.id,
      index,
      type: node.type.toLocaleLowerCase(),
    }),
  });
  appendCSS(element, {
    display: node.isVisible ? 'block' : 'none',
    opacity: node.opacity,
    ...transformToCSS(node.relativeTransform),
  });

  return element;
}
