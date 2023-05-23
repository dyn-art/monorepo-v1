import { TPaint } from '@pda/shared-types';
import { logger } from '../../../../shared';
import { uploadDataToBucket } from './upload-data-to-bucket';

export async function handleFills(inputFills: Paint[]): Promise<TPaint[]> {
  if (!Array.isArray(inputFills)) return [];
  const fills: TPaint[] = [];

  for (const fill of inputFills) {
    if (!fill.visible) continue;
    switch (fill.type) {
      case 'GRADIENT_ANGULAR':
      case 'GRADIENT_DIAMOND':
      case 'GRADIENT_LINEAR':
      case 'GRADIENT_RADIAL':
        fills.push(fill);
        continue;
      case 'IMAGE':
        fills.push(await handleImageFill(fill));
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

async function handleImageFill(fill: ImagePaint) {
  let imageHash = fill.imageHash;
  if (imageHash == null) return fill;
  const imageData = await figma.getImageByHash(imageHash)?.getBytesAsync();
  imageHash = await uploadDataToBucket(imageHash, imageData);
  if (imageHash == null) {
    throw new Error(
      `Failed to upload image with the hash ${imageHash} to S3 bucket!`
    );
  }
  logger.info(`Uploaded image to S3 bucket under the key '${imageHash}'.`);
  return { ...fill, imageHash };
}
