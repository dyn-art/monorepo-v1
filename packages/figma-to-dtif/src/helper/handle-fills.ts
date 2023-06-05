import { TImagePaint, TPaint } from '@pda/dtif-types';
import { UploadStaticDataException } from '../exceptions';
import { ExportImageException } from '../exceptions/ExportImageException';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { getImageType } from '../utils';
import { convert2DMatrixTo3DMatrix } from './convert-2d-matrix-to-3d-matrix';

export async function handleFills(
  node: SceneNode,
  inputFills: Paint[],
  config: TFormatNodeConfig
): Promise<TPaint[]> {
  if (!Array.isArray(inputFills)) return [];
  const fills: TPaint[] = [];

  for (const fill of inputFills) {
    if (!fill.visible) continue;
    switch (fill.type) {
      case 'GRADIENT_ANGULAR':
      case 'GRADIENT_DIAMOND':
      case 'GRADIENT_LINEAR':
      case 'GRADIENT_RADIAL':
        fills.push({
          ...fill,
          gradientTransform: convert2DMatrixTo3DMatrix(fill.gradientTransform),
        });
        continue;
      case 'IMAGE':
        fills.push(await handleImageFill(node, fill, config.uploadStaticData));
        continue;
      case 'SOLID':
        fills.push(fill);
        continue;
      default:
      // do nothing
    }
  }

  return fills;
}

async function handleImageFill(
  node: SceneNode,
  fill: ImagePaint,
  uploadStaticData: TFormatNodeConfig['uploadStaticData']
): Promise<TImagePaint> {
  const imageTransform =
    fill.imageTransform != null
      ? convert2DMatrixTo3DMatrix(fill.imageTransform)
      : undefined;

  // Export image
  const imageHash = fill.imageHash;
  if (imageHash == null)
    return {
      ...fill,
      imageTransform,
    };
  const imageData = await exportImage(node, imageHash);

  // Upload image data
  const key = await uploadStaticData(
    imageHash,
    imageData,
    getImageType(imageData) ?? undefined
  );
  if (key == null) {
    throw new UploadStaticDataException(
      `Failed to upload image with the hash ${key} to S3 bucket!`,
      node
    );
  }

  return {
    ...fill,
    imageHash: key,
    imageTransform,
  };
}

async function exportImage(node: SceneNode, imageHash: string) {
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
