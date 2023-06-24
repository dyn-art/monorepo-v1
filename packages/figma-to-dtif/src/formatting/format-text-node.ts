import { ENodeTypes, TTextNode } from '@pda/dtif-types';
import { convert2DMatrixTo3DMatrix, handleFills } from '../utils';
import { TFormatNodeConfig } from './format-root';

export async function formatTextNode(
  node: TextNode,
  config: TFormatNodeConfig
): Promise<TTextNode> {
  return {
    type: ENodeTypes.TEXT,
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
    effects: node.effects,
    // Fills mixin
    fills: await handleFills(node, node.fills as Paint[], config),
  } as TTextNode;
}
