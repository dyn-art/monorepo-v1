import { TGradientPaint, TImagePaint, TPaint } from '@pda/dtif-types';
import { UploadStaticDataException } from '../exceptions';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { exportImageFill, getImageType } from '../utils';
import { exportAndUploadNode } from '../utils/export-and-upload-node';
import { convert2DMatrixTo3DMatrix } from './convert-2d-matrix-to-3d-matrix';
import { isNodeWithFills, isTextNode } from './is-node';

export async function handleFills(
  node: SceneNode,
  inputFills: Paint[],
  config: TFormatNodeConfig
): Promise<TPaint[]> {
  const fillPromises = inputFills.map((fill) => {
    if (!fill.visible) return Promise.resolve(null);
    switch (fill.type) {
      case 'GRADIENT_ANGULAR':
      case 'GRADIENT_DIAMOND':
        return handleGradientFill(node, fill, { ...config, format: 'JPG' });
      case 'GRADIENT_LINEAR':
      case 'GRADIENT_RADIAL':
        return handleGradientFill(node, fill, { ...config, format: 'SVG' });
      case 'IMAGE':
        return handleImageFill(node, fill, config);
      case 'SOLID':
        return Promise.resolve(fill);
      default:
        return Promise.resolve(null);
    }
  });
  const fills = await Promise.all(fillPromises);
  return fills.filter((fill) => fill != null) as TPaint[];
}

async function handleImageFill(
  node: SceneNode,
  fill: ImagePaint,
  config: TFormatNodeConfig
): Promise<TImagePaint> {
  let uploaded = false;
  const imageTransform =
    fill.imageTransform != null
      ? convert2DMatrixTo3DMatrix(fill.imageTransform)
      : undefined;

  // Check whether image fill has actual image
  let imageHash: string | null = fill.imageHash;
  if (imageHash == null) {
    return {
      ...fill,
      transform: imageTransform,
    };
  }

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
    ...fill,
    hash: imageHash,
    inline: uploaded ? undefined : imageData,
    transform: imageTransform,
  };
}

async function handleGradientFill(
  node: SceneNode,
  fill: GradientPaint,
  config: TFormatNodeConfig & { format: 'SVG' | 'JPG' }
): Promise<TGradientPaint> {
  let exported: TGradientPaint['exported'] | null = null;

  if (
    config.gradientToSVG &&
    isNodeWithFills(node) &&
    node.fills !== figma.mixed
  ) {
    // Clone node with the relevant fill
    const clone = cloneToFillNode(node, [fill]);

    // Export gradient fill node to specified format
    const { hash, data, uploaded } = await exportAndUploadNode(clone, {
      uploadStaticData: config.uploadStaticData,
      export: { format: config.format },
    });

    exported = {
      type: config.format,
      hash: hash,
      inline: uploaded ? undefined : data,
    };
  }

  return {
    type: fill.type,
    gradientStops: fill.gradientStops as ColorStop[],
    blendMode: fill.blendMode,
    opacity: fill.opacity,
    visible: fill.visible,
    transform: convert2DMatrixTo3DMatrix(fill.gradientTransform),
    exported: exported ?? undefined,
  };
}

function cloneToFillNode(node: TNodeWithFills, fills: Paint[]): SceneNode {
  const clone = isTextNode(node)
    ? createRectangleNodeFromTextNode(node)
    : node.clone();

  // Apply only relevant fill
  clone.fills = fills;

  // Reset transform
  clone.x = 0;
  clone.y = 0;
  clone.rotation = 0;
  clone.relativeTransform = [
    [1, 0, 0],
    [0, 1, 0],
  ];

  return clone;
}

function createRectangleNodeFromTextNode(node: TextNode): RectangleNode {
  const rect = figma.createRectangle();
  rect.x = node.x;
  rect.y = node.y;
  rect.resize(node.width, node.height);
  rect.rotation = node.rotation;
  rect.relativeTransform = node.relativeTransform;
  return rect;
}

export type TNodeWithFills =
  | RectangleNode
  | FrameNode
  | ComponentNode
  | InstanceNode
  | TextNode;
