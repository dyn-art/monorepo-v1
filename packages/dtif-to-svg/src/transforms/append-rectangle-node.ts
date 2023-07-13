import { appendBasicShapeNodeElement } from '@/helpers/d3';
import { createRectanglePath } from '@/helpers/paths';
import { TD3SVGElementSelection } from '@/types';
import { TRectangleNode } from '@pda/types/dtif';

export async function appendRectangleNode(
  parent: TD3SVGElementSelection,
  props: {
    node: TRectangleNode;
    index?: number;
  }
) {
  const { node, index = 0 } = props;
  return appendBasicShapeNodeElement(parent, {
    node,
    index,
    shapeAppend: async (parent) => {
      return parent.append('path').attr(
        'd',
        createRectanglePath({
          width: node.width,
          height: node.height,
          topLeftRadius: node.topLeftRadius,
          topRightRadius: node.topRightRadius,
          bottomRightRadius: node.bottomRightRadius,
          bottomLeftRadius: node.bottomLeftRadius,
        })
      );
    },
  });
}
