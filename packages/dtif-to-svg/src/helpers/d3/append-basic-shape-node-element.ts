import { TD3SVGElementSelection, TD3Selection } from '@/types';
import {
  TEllipseNode,
  TPolygonNode,
  TRectangleNode,
  TStarNode,
} from '@pda/types/dtif';
import { getElementId } from '../other';
import { appendNodeWrapperGElement } from './append-node-wrapper-g-element';

export async function appendBasicShapeNodeElement(
  parent: TD3SVGElementSelection,
  props: {
    node: TRectangleNode | TEllipseNode | TStarNode | TPolygonNode;
    shapeAppend: (
      parent: TD3SVGElementSelection
    ) => Promise<TD3SVGElementSelection>;
    index?: number;
  }
): Promise<TD3Selection<SVGGElement>> {
  const { node, shapeAppend, index = 0 } = props;
  const fillClipPathId = getElementId({
    id: node.id,
    index,
    type: node.type.toLocaleLowerCase(),
    category: 'fill-clip',
    isDefinition: true,
  });

  // Create element
  const gElement = appendNodeWrapperGElement(parent, { node, index });

  // Append children
  await appendDefsElement(gElement, { fillClipPathId, shapeAppend });
  // TODO: fill

  return gElement;
}

async function appendDefsElement(
  parent: TD3SVGElementSelection,
  props: {
    fillClipPathId: string;
    shapeAppend: (
      parent: TD3SVGElementSelection
    ) => Promise<TD3SVGElementSelection>;
  }
) {
  const defsElement = parent.append('defs');
  await appendClipPathElement(defsElement, props);
  return defsElement;
}

async function appendClipPathElement(
  parent: TD3SVGElementSelection,
  props: {
    fillClipPathId: string;
    shapeAppend: (
      parent: TD3SVGElementSelection
    ) => Promise<TD3SVGElementSelection>;
  }
) {
  const { fillClipPathId, shapeAppend } = props;
  const clipPathElement = parent.append('clipPath').attr('id', fillClipPathId);

  // Append children
  await shapeAppend(clipPathElement);

  return clipPathElement;
}
