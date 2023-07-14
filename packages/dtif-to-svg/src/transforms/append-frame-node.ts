import {
  appendAttributes,
  appendClipPath,
  appendNodeWrapper,
} from '@/helpers/d3';
import { getElementId } from '@/helpers/other';
import { TD3SVGElementSelection } from '@/types';
import { TFrameNode } from '@pda/types/dtif';
import { appendFill } from './append-fill';
import { appendNode } from './append-node';

export async function appendFrameNode(
  parent: TD3SVGElementSelection,
  props: {
    node: TFrameNode;
    index?: number;
  }
) {
  const { node, index = 0 } = props;
  const contentClipPathId = getElementId({
    id: node.id,
    index,
    type: 'frame',
    category: 'content-clip',
    isDefinition: true,
  });
  const fillClipPathId = getElementId({
    id: node.id,
    index,
    type: 'frame',
    category: 'fill-clip',
    isDefinition: true,
  });

  // Create element
  const wrapperElement = appendNodeWrapper(parent, { node, index });

  // Append children
  await appendFrameContent(wrapperElement, {
    node,
    index,
    fillClipPathId,
    contentClipPathId,
  });
  if (node.clipsContent) {
    await appendClipPath(wrapperElement, {
      clipPathId: contentClipPathId,
      clipElement: {
        props: { node },
        callback: async (parent, { node }) => {
          const element = parent.append('rect');
          appendAttributes(element, {
            width: node.width,
            height: node.height,
          });
          return element;
        },
      },
    });
  }

  return wrapperElement;
}

async function appendFrameContent(
  parent: TD3SVGElementSelection,
  props: {
    node: TFrameNode;
    index?: number;
    fillClipPathId: string;
    contentClipPathId: string;
  }
) {
  const { node, index = 0, fillClipPathId, contentClipPathId } = props;

  // Create element
  const frameContentElement = parent.append('g');
  appendAttributes(frameContentElement, {
    id: getElementId({
      id: node.id,
      index,
      type: 'frame',
      category: 'content',
    }),
    clipPath: node.clipsContent ? `url(#${contentClipPathId})` : undefined,
  });

  // Append children
  await appendClipPath(frameContentElement, {
    clipPathId: fillClipPathId,
    clipElement: {
      props: { node },
      callback: async (parent, { node }) => {
        const element = parent.append('rect');
        appendAttributes(element, {
          width: node.width,
          height: node.height,
        });
        return element;
      },
    },
  });
  await appendFill(parent, { node, clipPathId: fillClipPathId });
  await appendChildren(parent, { node, index });

  return frameContentElement;
}

async function appendChildren(
  parent: TD3SVGElementSelection,
  props: { node: TFrameNode; index: number }
) {
  const { node, index = 0 } = props;

  // Create element
  const childrenElement = parent.append('g');
  appendAttributes(childrenElement, {
    id: getElementId({
      id: node.id,
      index,
      type: 'frame',
      category: 'children',
    }),
  });

  // Append children
  node.children.map((child, i) => {
    appendNode(childrenElement, { node: child, index: i });
  });

  return childrenElement;
}
