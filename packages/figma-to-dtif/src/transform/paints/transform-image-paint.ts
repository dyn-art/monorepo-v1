import {
  ExportImagePaintException,
  UnsupportedFigmaPaintException,
} from '@/exceptions';
import {
  TExportImageDataResponse,
  convert2DMatrixTo3DMatrix,
  exportImageData,
  uploadStaticData,
} from '@/helpers';
import { TTransformNodeOptions } from '@/types';
import { TImagePaint } from '@dyn/types/dtif';

export async function transformImagePaint(
  paint: ImagePaint,
  node: SceneNode,
  options: TTransformNodeOptions['imagePaint']
): Promise<TImagePaint> {
  // Try to resolve image content based on image hash
  const { hash, content, size } = await resolveImageContent(
    node,
    paint.imageHash ?? undefined,
    options
  );

  const basePaintProps: Omit<TImagePaint, 'scaleMode'> = {
    type: 'IMAGE',
    hash,
    content: content ?? undefined,
    opacity: paint.opacity ?? 1,
    blendMode: paint.blendMode ?? 'PASS_THROUGH',
    isVisible: paint.visible ?? true,
    filters: paint.filters,
    width: size.width,
    height: size.height,
  };

  switch (paint.scaleMode) {
    case 'CROP':
      return {
        ...basePaintProps,
        scaleMode: 'CROP',
        transform: convert2DMatrixTo3DMatrix(
          paint.imageTransform ?? [
            [0, 0, 1],
            [1, 0, 0],
          ]
        ),
      };
    case 'FILL':
      return {
        ...basePaintProps,
        scaleMode: 'FILL',
        rotation: paint.rotation ?? 0,
      };
    case 'FIT':
      return {
        ...basePaintProps,
        scaleMode: 'FIT',
        rotation: paint.rotation ?? 0,
      };
    case 'TILE':
      return {
        ...basePaintProps,
        scaleMode: 'TILE',
        rotation: paint.rotation ?? 0,
        scalingFactor: paint.scalingFactor ?? 1,
      };
    default:
      throw new UnsupportedFigmaPaintException(paint, node);
  }
}

async function resolveImageContent(
  node: SceneNode,
  imageHash?: string,
  options: TTransformNodeOptions['imagePaint'] = {}
): Promise<{
  hash: string;
  content: Uint8Array | string | null;
  size: TExportImageDataResponse['size'];
}> {
  const {
    exportOptions: {
      inline = true,
      uploadStaticData: uploadStaticDataCallback,
    } = {},
  } = options;

  // Try to resolve image as Uint8Array
  if (imageHash == null) {
    throw new ExportImagePaintException(node, `No valid image hash found!`);
  }
  let hash = imageHash;
  const imageData = await exportImageData(hash, node);
  let content: Uint8Array | string | null = imageData.content;
  const size = imageData.size;

  // Upload image content if it could be resolved
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

  return { content, hash, size };
}
