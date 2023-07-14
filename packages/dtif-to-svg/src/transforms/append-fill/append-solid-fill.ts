import { rgbToCSS } from '@/helpers/css';
import { getElementId } from '@/helpers/other';
import { TD3SVGElementSelection } from '@/types';
import { TNode, TSolidPaint } from '@pda/types/dtif';
import { appendAttributes, appendCSS } from '../../helpers/d3';

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
  const element = parent.append('rect');
  appendAttributes(element, {
    id: getElementId({
      id: node.id,
      index,
      type: 'paint',
      category: 'solid',
    }),
    height: node.height,
    width: node.width,
  });
  appendCSS(element, {
    fill: rgbToCSS(paint.color),
    opacity: paint.opacity,
  });

  return element;
}
