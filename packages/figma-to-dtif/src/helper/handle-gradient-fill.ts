import { TGradientPaint } from '@pda/dtif-types';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { TNodeWithFills } from '../types';
import { exportAndUploadNode } from '../utils/export-and-upload-node';
import { convert2DMatrixTo3DMatrix } from './convert-2d-matrix-to-3d-matrix';
import { isNodeWithFills, isTextNode } from './is-node';

export async function handleGradientFill(
  node: SceneNode,
  fill: GradientPaint,
  config: TFormatNodeConfig & { format: 'SVG' | 'JPG' }
): Promise<TGradientPaint> {
  let exported: TGradientPaint['exported'] | null = null;

  // Export gradient fill
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

    // Remove clone as its shown in editor
    clone.remove();

    exported = {
      type: config.format,
      hash: hash,
      inline: uploaded ? undefined : data,
    };
  }

  return {
    type: fill.type,
    gradientStops: fill.gradientStops as ColorStop[],
    blendMode: fill.blendMode ?? 'PASS_THROUGH',
    opacity: fill.opacity ?? 1,
    visible: fill.visible ?? true,
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
