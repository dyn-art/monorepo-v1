import { sha256, uploadStaticData } from '@/helpers';
import { logger } from '@/logger';
import {
  TContentType,
  TTransformNodeOptions,
  TTypeFaceWithoutContent,
} from '@/types';
import { TTypeface } from '@pda/types/dtif';
import { extractErrorData } from '@pda/utils';

export async function transformTypeface(
  typeface: TTypeFaceWithoutContent,
  node: TextNode,
  options: TTransformNodeOptions
): Promise<TTypeface> {
  // Try to resolve font content based on typeface
  const { hash, content } = await resolveFontContent(
    node,
    typeface,
    options['font']
  );

  return {
    ...typeface,
    content: content ?? undefined,
    hash: hash ?? undefined,
  } as TTypeface;
}

async function resolveFontContent(
  node: TextNode,
  typeFace: TTypeFaceWithoutContent,
  options: TTransformNodeOptions['font'] = {}
): Promise<{
  hash: string | null;
  content: Uint8Array | string | null;
}> {
  const {
    exportOptions: {
      inline = true,
      uploadStaticData: uploadStaticDataCallback,
    } = {},
    resolveFontContent: resolveFontContentCallback,
  } = options;
  let content: Uint8Array | string | null = null;
  let contentType: TContentType | null = null;
  let hash: string | null = null;

  if (typeof resolveFontContentCallback !== 'function') {
    return { content, hash };
  }

  // Try to resolve font as Uint8Array
  try {
    const font = await resolveFontContentCallback(typeFace);
    content = font.content;
    contentType = font.contentType;
  } catch (error) {
    const errorData = extractErrorData(error);
    logger.error(
      `Failed to resolve font content by error: ${errorData.message}`
    );
  }

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
          contentType: contentType ?? undefined,
        }
      );
      hash = uploadResponse.key;
      content = uploadResponse.url ?? null;
    }
  }

  return { content, hash };
}
