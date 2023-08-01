import { MixedNotSupportedException } from '@/exceptions';
import { convert2DMatrixTo3DMatrix, sha256, uploadStaticData } from '@/helpers';
import { TTransformNodeOptions, TTypeFaceWithoutContent } from '@/types';
import { TTextNode } from '@pda/types/dtif';

export async function transformTextNode(
  node: TextNode,
  options: TTransformNodeOptions
) {
  const fontName = excludeMixed('fontName', node);
  const fontWeight = excludeMixed('fontWeight', node);
  const fontSize = excludeMixed('fontSize', node);
  const letterSpacing = excludeMixed('letterSpacing', node);
  const lineHeight = excludeMixed('lineHeight', node);

  // Construct type face
  const typeFace: TTypeFaceWithoutContent = {
    family: fontName.family,
    styleName: fontName.style,
    fontWeight,
    style: fontName.style.toLowerCase().includes('italic')
      ? 'italic'
      : 'regular',
  };

  // Try to resolve font based on type face
  const { hash, content } = await resolveFontContent(
    node,
    typeFace,
    options.font
  );

  return {
    type: 'TEXT',
    textAlignHorizontal: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical,
    fontSize,
    letterSpacing,
    lineHeight,
    characters: node.characters,
    font: {
      ...typeFace,
      hash,
      content,
    },
    // Base node mixin
    id: node.id,
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
    fillGeometry: node.fillGeometry,
    strokeGeometry: node.strokeGeometry,
    // Blend mixin
    blendMode: node.blendMode,
    opacity: node.opacity,
    isMask: node.isMask,
    // Effect mixin
    effects: node.effects,
    // Fills mixin
    fills: [] as string[], // Will be set by Composition class
  } as TTextNode;
}

async function resolveFontContent(
  node: TextNode,
  typeFace: TTypeFaceWithoutContent,
  options: TTransformNodeOptions['font'] = {}
): Promise<{
  hash?: string;
  content: Uint8Array | string | null;
}> {
  const {
    exportOptions: {
      inline = true,
      uploadStaticData: uploadStaticDataCallback,
    } = {},
    resolveFontContent: resolveFontContentCallback,
  } = options;
  if (typeof resolveFontContentCallback !== 'function') {
    return { content: null };
  }

  // Try to resolve font as Uint8Array
  let content: Uint8Array | string | null =
    (await resolveFontContentCallback(typeFace)) ?? null;
  let hash: string | null = null;

  if (content != null) {
    hash = sha256(content);

    // Upload font content if it could be resolved
    // and shouldn't be put inline
    if (uploadStaticDataCallback != null && !inline) {
      const uploadResponse = await uploadStaticData(
        uploadStaticDataCallback,
        content,
        {
          node,
          key: hash,
        }
      );
      hash = uploadResponse.key;
      content = uploadResponse.url ?? null;
    }
  }

  return { content, hash: hash ?? undefined };
}

function excludeMixed<T extends keyof TextNode>(
  property: T,
  node: TextNode
): TExcludeMixed<TextNode[T]> {
  const value = node[property];
  if (value === figma.mixed) {
    throw new MixedNotSupportedException(property, node);
  }
  return value as TExcludeMixed<TextNode[T]>;
}

type TExcludeMixed<T> = T extends PluginAPI['mixed'] ? never : T;
