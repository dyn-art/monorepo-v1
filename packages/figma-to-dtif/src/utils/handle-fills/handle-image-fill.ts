import { TImagePaint } from '@pda/dtif-types';
import {
  ExportImageException,
  UploadStaticDataException,
} from '../../exceptions';
import { TFormatNodeConfig } from '../../formatting';
import { convert2DMatrixTo3DMatrix } from '../convert-2d-matrix-to-3d-matrix';
import { exportImageFill } from '../export-image-fill';
import { getImageType } from '../get-image-type';

export async function handleImageFill(
  node: SceneNode,
  fill: ImagePaint,
  config: TFormatNodeConfig
): Promise<TImagePaint> {
  const { hash, inline } = await uploadImage(node, fill, config);
  const baseFillProps: Omit<TImagePaint, 'scaleMode'> = {
    type: 'IMAGE',
    hash,
    inline,
    opacity: fill.opacity ?? 1,
    blendMode: fill.blendMode ?? 'PASS_THROUGH',
    visible: fill.visible ?? true,
    filters: fill.filters,
  };
  switch (fill.scaleMode) {
    case 'CROP':
      return {
        ...baseFillProps,
        scaleMode: 'CROP',
        transform: convert2DMatrixTo3DMatrix(
          fill.imageTransform ?? [
            [0, 0, 1],
            [1, 0, 0],
          ]
        ),
      };
    case 'FILL':
      return {
        ...baseFillProps,
        scaleMode: 'FILL',
        rotation: fill.rotation ?? 0,
      };
    case 'FIT':
      return {
        ...baseFillProps,
        scaleMode: 'FIT',
        rotation: fill.rotation ?? 0,
      };
    case 'TILE':
      return {
        ...baseFillProps,
        scaleMode: 'TILE',
        rotation: fill.rotation ?? 0,
        scalingFactor: fill.scalingFactor ?? 1,
      };
    default:
    // do nothing
  }
  return fill as unknown as TImagePaint;
}

async function uploadImage(
  node: SceneNode,
  fill: ImagePaint,
  config: TFormatNodeConfig
): Promise<{
  hash: TImagePaint['hash'];
  inline: TImagePaint['inline'];
}> {
  let uploaded = false;

  // Check whether image fill has actual image
  if (fill.imageHash == null) {
    throw new ExportImageException(
      `Can't export node '${node.name}' as it has no valid image hash!`,
      node
    );
  }
  let imageHash = fill.imageHash;

  // Export image
  const imageData = await exportImageFill(node, imageHash);

  // Upload image data
  if (config.uploadStaticData != null) {
    imageHash = await config.uploadStaticData(
      imageHash,
      imageData,
      getImageType(imageData) ?? undefined
    );
    if (imageHash == null) {
      throw new UploadStaticDataException(
        `Failed to upload image with the hash ${imageHash} to S3 bucket!`,
        node
      );
    }
    uploaded = true;
  }

  return {
    hash: imageHash,
    inline: uploaded ? undefined : imageData,
  };
}
