import { TEffect, TPolygonNode } from '@pda/types/dtif';
import { TFormatNodeOptions } from '../types';
import { convert2DMatrixTo3DMatrix } from '../utils';
import { formatFills } from './format-fills';

export async function formatPolygonNode(
  node: PolygonNode,
  options: TFormatNodeOptions
): Promise<TPolygonNode> {
  return {
    type: 'POLYGON',
    pointCount: node.pointCount,
    // BasNode mixin
    id: node.id,
    name: node.name,
    // SceneNode mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    // Effect mixin
    effects: node.effects as TEffect[],
    // Fills mixin
    fills: await formatFills(node, node.fills as Paint[], options),
  };
}
