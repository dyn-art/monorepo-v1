import { TTextNode } from '@pda/dtif-types';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { convert2DMatrixTo3DMatrix, handleFills } from '../helper';

export async function formatTextNode(
  node: TextNode,
  config: TFormatNodeConfig
): Promise<TTextNode> {
  return {
    type: 'TEXT',
    textAlignHorizontal: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical,
    fontSize: node.fontSize,
    fontName: node.fontName,
    fontWeight: node.fontWeight,
    letterSpacing: node.letterSpacing,
    lineHeight: node.lineHeight,
    characters: node.characters,
    // BasNode mixin
    id: node.id,
    name: node.name,
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: convert2DMatrixTo3DMatrix(node.relativeTransform),
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
    // Fills mixin
    fills: await handleFills(node, node.fills as Paint[], config),
  } as TTextNode;
}
