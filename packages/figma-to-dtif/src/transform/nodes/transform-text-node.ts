import { convert2DMatrixTo3DMatrix, excludeMixed } from '@/helpers';
import { TTransformNodeOptions } from '@/types';
import { TEffect, TTextNode, TVectorPath } from '@dyn/types/dtif';

export async function transformTextNode(
  node: TextNode,
  options: TTransformNodeOptions
): Promise<TTextNode> {
  const { geometry = true } = options;

  const fontSize = excludeMixed(node, 'fontSize');
  const letterSpacing = excludeMixed(node, 'letterSpacing');
  const lineHeight = excludeMixed(node, 'lineHeight');

  return {
    type: 'TEXT',
    textAlignHorizontal: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical,
    fontSize,
    letterSpacing,
    lineHeight,
    characters: node.characters,
    typefaceId: undefined, // Will be set by Composition class
    fallbackTypefaceIds: [], // Will be set by Composition class
    // Base node mixin
    name: node.name,
    // Scene node mixin
    isLocked: node.locked,
    isVisible: node.visible,
    // Layout mixin
    height: node.height,
    width: node.width,
    relativeTransform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Constraints mixin
    constraints: node.constraints,
    // Geometry mixin
    geometry: geometry
      ? {
          fill: node.fillGeometry as TVectorPath[],
          stroke: node.strokeGeometry as TVectorPath[],
        }
      : undefined,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    // Effect mixin
    effects: node.effects as TEffect[],
    // Fill mixin
    fill: { paintIds: [] }, // Will be set by Composition class
  };
}
