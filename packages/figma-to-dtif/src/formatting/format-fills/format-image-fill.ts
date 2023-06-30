import { TImagePaint } from '@pda/dtif-types';
import {
  ExportImageException,
  UploadStaticDataException,
} from '../../exceptions';
import { TFormatImageFillOptions } from '../../types';
import { convert2DMatrixTo3DMatrix } from '../../utils/convert-2d-matrix-to-3d-matrix';
import { exportImageData } from '../../utils/export-image-fill';
import { getImageType } from '../../utils/get-image-type';

export async function formatImageFill(
  node: SceneNode,
  fill: ImagePaint,
  options: TFormatImageFillOptions = {}
): Promise<TImagePaint> {
  const { hash, inline, size } = await exportAndUploadImage(
    node,
    fill.imageHash,
    options
  );
  const baseFillProps: Omit<TImagePaint, 'scaleMode'> = {
    type: 'IMAGE',
    hash,
    inline,
    opacity: fill.opacity ?? 1,
    blendMode: fill.blendMode ?? 'PASS_THROUGH',
    visible: fill.visible ?? true,
    filters: fill.filters,
    width: size.width,
    height: size.height,
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

async function exportAndUploadImage(
  node: SceneNode,
  imageHash: string | null,
  options: TFormatImageFillOptions
): Promise<{
  hash: TImagePaint['hash'];
  inline: TImagePaint['inline'];
  size: { width: number; height: number };
}> {
  const { uploadStaticData } = options;
  let uploaded = false;

  // Check whether image fill has actual image
  if (imageHash == null) {
    throw new ExportImageException(
      `Can't export node '${node.name}' as it has no valid image hash!`,
      node
    );
  }

  // Export image
  const { data: imageData, size: imageSize } = await exportImageData(
    imageHash,
    node
  );

  // Upload image data
  if (uploadStaticData != null) {
    imageHash = await uploadStaticData(
      imageHash,
      imageData,
      getImageType(imageData) ?? undefined
    );
    if (imageHash == null) {
      throw new UploadStaticDataException(
        `Failed to upload image with the hash ${imageHash}!`,
        node
      );
    }
    uploaded = true;
  }

  return {
    hash: imageHash,
    inline: uploaded ? undefined : imageData,
    size: imageSize,
  };
}
