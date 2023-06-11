import { ExportImageException } from '../exceptions';

export async function exportImageFill(node: SceneNode, imageHash: string) {
  let data: Uint8Array | null;
  try {
    data = (await figma.getImageByHash(imageHash)?.getBytesAsync()) ?? null;
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
  if (data == null) {
    throw new ExportImageException(
      `Failed to export node '${node.name}' as image!`,
      node
    );
  }
  return data;
}
