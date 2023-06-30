import {
  TGradientPaint,
  TGradientPaintExported,
  TLinearGradientPaintInline,
  TRadialGradientPaintInline,
} from '@pda/dtif-types';
import { TSVGElement, svgParser } from '@pda/svgson';
import { decodeUint8Array } from '@pda/utils';
import { logger } from '../../logger';
import { TFormatGradientFillOptions, TNodeWithFills } from '../../types';
import { convert2DMatrixTo3DMatrix } from '../../utils/convert-2d-matrix-to-3d-matrix';
import { exportAndUploadNode } from '../../utils/export-and-upload-node';
import { exportNode } from '../../utils/export-node';
import { isNodeWithFills, isTextNode } from '../../utils/is-node';
import { resetNodeTransform } from '../../utils/reset-node-transform';

export async function formatGradientFill(
  node: SceneNode,
  fill: GradientPaint,
  options: TFormatGradientFillOptions = {}
) {
  if (!isNodeWithFills(node) || node.fills === figma.mixed) {
    return null;
  }

  switch (fill.type) {
    case 'GRADIENT_LINEAR':
      return options.inline
        ? formatToInlineLinearGradientPaint(node, fill)
        : formatToGradientPaintExported(node, fill, options.exportOptions);
    case 'GRADIENT_RADIAL':
      return options.inline
        ? formatToInlineRadialGradientPaint(node, fill)
        : formatToGradientPaintExported(node, fill, options.exportOptions);
    case 'GRADIENT_ANGULAR':
      return formatToGradientPaintExported(node, fill, options.exportOptions);
    case 'GRADIENT_DIAMOND':
      return formatToGradientPaintExported(node, fill, options.exportOptions);
    default:
    // do nothing
  }

  return null;
}

async function formatToInlineLinearGradientPaint(
  node: TNodeWithFills,
  fill: GradientPaint
): Promise<TLinearGradientPaintInline> {
  let gradient: TLinearGradientPaintInline;
  const fillNode = createFillNode(node, [fill]);

  try {
    // Export fill to SVG and extract relevant gradient values
    // TODO: figure out how to calculate start & end without requiring on svg data
    const rawUint8Array = await exportNode(fillNode, { format: 'SVG' });
    const raw = decodeUint8Array(rawUint8Array);
    const svgObject = svgParser.parse(raw);
    const gradientElement = findGradient(svgObject);

    // Build gradient object
    gradient = {
      gradientStops: fill.gradientStops,
      transform: convert2DMatrixTo3DMatrix(fill.gradientTransform),
      start: {
        x: +(gradientElement?.attributes['x1'] ?? -1),
        y: +(gradientElement?.attributes['y1'] ?? -1),
      },
      end: {
        x: +(gradientElement?.attributes['x2'] ?? -1),
        y: +(gradientElement?.attributes['y2'] ?? -1),
      },
      ...getGradientBaseFillProperties(fill),
    } as TLinearGradientPaintInline;

    fillNode.remove();
  } catch (error) {
    fillNode.remove();
    throw error;
  }

  return gradient;
}
async function formatToInlineRadialGradientPaint(
  node: TNodeWithFills,
  fill: GradientPaint
): Promise<TRadialGradientPaintInline> {
  let gradient: TRadialGradientPaintInline;
  const fillNode = createFillNode(node, [fill]);

  try {
    // Export fill to SVG and extract relevant gradient values
    // TODO: figure out how to calculate radius without requiring on svg data
    const rawUint8Array = await exportNode(fillNode, { format: 'SVG' });
    const raw = decodeUint8Array(rawUint8Array);
    const svgObject = svgParser.parse(raw);
    const gradientElement = findGradient(svgObject);

    // Build gradient object
    gradient = {
      gradientStops: fill.gradientStops,
      transform: convert2DMatrixTo3DMatrix(fill.gradientTransform),
      radius: +(gradientElement?.attributes['r'] ?? -1),
      ...getGradientBaseFillProperties(fill),
    } as TRadialGradientPaintInline;

    fillNode.remove();
  } catch (error) {
    fillNode.remove();
    throw error;
  }

  return gradient;
}

async function formatToGradientPaintExported(
  node: TNodeWithFills,
  fill: GradientPaint,
  options: TFormatGradientFillOptions['exportOptions'] = {}
): Promise<TGradientPaintExported> {
  const { uploadStaticData } = options;
  let format = options.format ?? 'JPG';
  let gradient: TGradientPaintExported;
  const fillNode = createFillNode(node, [fill]);

  // Change format if it can't be applied to gradient
  if (
    format === 'SVG' &&
    ('GRADIENT_ANGULAR' || fill.type === 'GRADIENT_DIAMOND')
  ) {
    format = 'JPG';
    logger.warn(
      `Angular and diamond gradients can't be exported as SVG! Affected node is '${node.name}'.`
    );
  }

  try {
    // Export and upload fill
    const { hash, data, uploaded } = await exportAndUploadNode(fillNode, {
      uploadStaticData,
      exportSettings: { format },
      clone: false, // Not cloning node again as the fill node is already cloned
    });

    // Build gradient object
    gradient = {
      isExported: true,
      format,
      hash,
      inline: uploaded ? undefined : data,
      ...getGradientBaseFillProperties(fill),
    } as TGradientPaintExported;

    fillNode.remove();
  } catch (error) {
    fillNode.remove();
    throw error;
  }

  return gradient;
}

export function getGradientBaseFillProperties(
  fill: GradientPaint
): Partial<TGradientPaint> {
  return {
    type: fill.type,
    blendMode: fill.blendMode ?? 'PASS_THROUGH',
    opacity: fill.opacity ?? 1,
    visible: fill.visible ?? true,
  };
}

function findGradient(svgObject: TSVGElement): TSVGElement | null {
  for (const child of svgObject.children) {
    if (child.type === 'defs') {
      for (const defsChild of child.children) {
        if (defsChild.type === 'linearGradient') {
          return defsChild;
        }
      }
    }
  }
  return null;
}

export function createFillNode(
  node: TNodeWithFills,
  fills: Paint[]
): TNodeWithFills {
  // TODO: add clone to specific clone group so that its organized
  const clone = isTextNode(node)
    ? createRectangleNodeFromTextNode(node)
    : node.clone();

  // Apply fills to clone
  clone.fills = fills;

  // Reset transform before upload so that the transform is not embedded into the SVG
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
