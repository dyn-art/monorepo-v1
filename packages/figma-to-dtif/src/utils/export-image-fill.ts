import { ExportImageException } from '../exceptions';

export async function exportImageData(
  imageHash: string,
  node: SceneNode
): Promise<{ data: Uint8Array; size: { width: number; height: number } }> {
  let data: Uint8Array | null = null;
  let size: { width: number; height: number } | null = null;

  try {
    const image = figma.getImageByHash(imageHash);
    if (image != null) {
      data = await image.getBytesAsync();
      size = await image.getSizeAsync();
    }
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    throw new ExportImageException(
      `Failed to export node '${node.name}' as image: ${errorMessage}`,
      node
    );
  }

  if (data == null || size == null) {
    throw new ExportImageException(
      `Failed to export node '${node.name}' as image!`,
      node
    );
  }

  return { data, size };
}
