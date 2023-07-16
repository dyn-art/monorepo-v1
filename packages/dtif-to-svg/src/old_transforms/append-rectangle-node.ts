import { appendAttributes, appendBasicShapeNode } from '@/helpers/d3';
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
  return appendBasicShapeNode(parent, {
    node,
    index,
    clipElement: {
      props: {
        node,
      },
      callback: async (parent, { node }) => {
        const element = parent.append('path');
        appendAttributes(element, {
          p: createRectanglePath({
            width: node.width,
            height: node.height,
            topLeftRadius: node.topLeftRadius,
            topRightRadius: node.topRightRadius,
            bottomRightRadius: node.bottomRightRadius,
            bottomLeftRadius: node.bottomLeftRadius,
          }),
        });
        return element;
      },
    },
  });
}
