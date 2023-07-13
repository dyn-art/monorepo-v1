import { TD3SVGElementSelection } from '@/types';
import { TNode } from '@pda/types/dtif';
import { transformToCSS } from '../css/transform-to-css';
import { getElementId } from '../other/get-element-id';
import { applyCSSToD3 } from './apply-css-to-d3';

export function appendNodeWrapperGElement(
  parent: TD3SVGElementSelection,
  props: { node: TNode; index?: number }
) {
  const { node, index = 0 } = props;

  // Create element
  const gElement = parent
    .append('g')
    .attr(
      'id',
      getElementId({ id: node.id, index, type: node.type.toLocaleLowerCase() })
    );

  // Apply styles
  applyCSSToD3(gElement, {
    display: node.isVisible ? 'block' : 'none',
    opacity: node.opacity,
    ...transformToCSS(node.relativeTransform),
  });

  return gElement;
}
