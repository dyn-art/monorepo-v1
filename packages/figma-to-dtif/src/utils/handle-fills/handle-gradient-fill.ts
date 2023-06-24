import { TGradientPaint } from '@pda/dtif-types';
import { TFormatNodeOptions } from '../../formatting/format-frame-to-scene';
import { TNodeWithFills } from '../../types';
import { convert2DMatrixTo3DMatrix } from '../convert-2d-matrix-to-3d-matrix';
import { exportAndUploadNode } from '../export-and-upload-node';
import { isNodeWithFills, isTextNode } from '../is-node';
import { resetNodeTransform } from '../reset-node-transform';

// TODO:
export async function handleGradientFill(
  node: SceneNode,
  fill: GradientPaint,
  config: TFormatNodeOptions & { format: 'SVG' | 'JPG' }
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

    try {
      // Export gradient fill node to specified format
      const { hash, data, uploaded } = await exportAndUploadNode(clone, {
        uploadStaticData: config.uploadStaticData,
        exportSettings: { format: config.format },
        clone: false, // Not cloning node again as its already cloned
      });

      removeClone(clone);

      exported = {
        type: config.format,
        hash: hash,
        inline: uploaded ? undefined : data,
      };
    } catch (e) {
      removeClone(clone);
      throw e;
    }
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

function removeClone(clone: SceneNode) {
  clone.remove();
}

function cloneToFillNode(node: TNodeWithFills, fills: Paint[]): SceneNode {
  const clone = isTextNode(node)
    ? createRectangleNodeFromTextNode(node)
    : node.clone();
  clone.fills = fills;
  resetNodeTransform(clone);
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
