import { ExportImagePaintException } from '@/exceptions';

export async function exportImageData(
  imageHash: string,
  node?: SceneNode
): Promise<TExportImageDataResponse> {
  let content: TExportImageDataResponse['content'] | null = null;
  let size: TExportImageDataResponse['size'] | null = null;

  try {
    const image = figma.getImageByHash(imageHash);
    if (image != null) {
      content = await image.getBytesAsync();
      size = await image.getSizeAsync();
    }
  } catch (error) {
    throw new ExportImagePaintException(node, error);
  }

  if (content == null || size == null) {
    throw new ExportImagePaintException(node);
  }

  return { content, size };
}

export type TExportImageDataResponse = {
  content: Uint8Array;
  size: { width: number; height: number };
};
