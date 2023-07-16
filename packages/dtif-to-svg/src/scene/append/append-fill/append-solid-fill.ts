import { rgbToCSS } from '@/helpers/css';
import { getElementId } from '@/helpers/other';
import { TNode, TSolidPaint } from '@pda/types/dtif';
import { D3Node } from '../../nodes';

export function appendSolidFill(
  parent: D3Node,
  props: {
    node: TNode;
    index: number;
    paint: TSolidPaint;
  }
) {
  const { node, paint, index } = props;

  // Create element
  const element = parent.append('rect', {
    attributes: {
      id: getElementId({
        id: node.id,
        index,
        type: 'paint',
        category: 'solid',
      }),
      height: node.height,
      width: node.width,
    },
    styles: {
      fill: rgbToCSS(paint.color),
      opacity: paint.opacity,
    },
  });

  return element;
}
