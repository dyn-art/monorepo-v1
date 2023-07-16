import { appendFill } from '@/old_transforms';
import { TD3SVGElementSelection } from '@/types';
import {
  TEllipseNode,
  TPolygonNode,
  TRectangleNode,
  TStarNode,
} from '@pda/types/dtif';
import { getElementId } from '../other';
import { TClipElement, appendClipPath } from './append-clip-path';
import { appendNodeWrapper } from './append-node-wrapper';

export async function appendBasicShapeNode<GClipElementProps>(
  parent: TD3SVGElementSelection,
  props: {
    node: TRectangleNode | TEllipseNode | TStarNode | TPolygonNode;
    clipElement: TClipElement<GClipElementProps>;
    index?: number;
  }
) {
  const { node, clipElement, index = 0 } = props;
  const fillClipPathId = getElementId({
    id: node.id,
    index,
    type: node.type.toLocaleLowerCase(),
    category: 'fill-clip',
    isDefinition: true,
  });

  // Create element
  const wrapperElement = appendNodeWrapper(parent, { node, index });

  // Append children
  await appendClipPath<GClipElementProps>(wrapperElement, {
    clipPathId: fillClipPathId,
    clipElement,
  });
  await appendFill(wrapperElement, { node, clipPathId: fillClipPathId });

  return wrapperElement;
}
