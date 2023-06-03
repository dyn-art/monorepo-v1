import { TTextNode } from '@pda/dtif-types';
import { handleFills } from '../helper';
import { TFormatNodeOptions } from './format-node';

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
    // Layout mixin
    x: node.x,
    y: node.y,
    height: node.height,
    width: node.width,
    rotation: node.rotation,
    transform: node.relativeTransform,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    effects: node.effects,
    // Fills mixin
    fills: await handleFills(node.fills as Paint[], options),
  } as TTextNode;
}
