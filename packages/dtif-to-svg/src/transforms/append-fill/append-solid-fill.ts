import { rgbToCSS } from '@/helpers/css';
import { getElementId } from '@/helpers/other';
import { TD3SVGElementSelection } from '@/types';
import { TNode, TSolidPaint } from '@pda/types/dtif';
import { applyCSSToD3 } from '../../helpers/d3';

export function appendSolidFill(
  parent: TD3SVGElementSelection,
  props: {
    node: TNode;
    index: number;
    paint: TSolidPaint;
  }
) {
  const { node, paint, index } = props;

  // Create element
  const element = parent
    .append('rect')
    .attr(
      'id',
      getElementId({
        id: node.id,
        index,
        type: 'paint',
        category: 'solid',
      })
    )
    .attr('width', node.width)
    .attr('height', node.height);

  // Apply styles
  applyCSSToD3(element, {
    fill: rgbToCSS(paint.color),
    opacity: paint.opacity,
  });

  return element;
}
