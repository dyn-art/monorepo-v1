import { TTextNode } from '@pda/types/dtif';
import { TFormatNodeOptions } from '../types';
import { convert2DMatrixTo3DMatrix } from '../utils';
import { formatFills } from './format-fills';

export async function formatTextNode(
  node: TextNode,
  options: TFormatNodeOptions
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
    effects: node.effects,
    // Fills mixin
    fills: await formatFills(node, node.fills as Paint[], options),
  } as TTextNode;
}
