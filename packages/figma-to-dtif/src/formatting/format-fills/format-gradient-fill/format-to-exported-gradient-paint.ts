import { TGradientPaintExported } from '@pda/types/dtif';
import { logger } from '../../../logger';
import { TFormatGradientFillOptions, TNodeWithFills } from '../../../types';
import {
  exportAndUploadNode,
  isTextNode,
  resetNodeTransform,
} from '../../../utils';
import { getGradientFillBaseProperties } from './get-gradient-fill-base-properties';

export async function formatToExportedGradientPaint(
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
      ...getGradientFillBaseProperties(fill),
    } as TGradientPaintExported;

    fillNode.remove();
  } catch (error) {
    fillNode.remove();
    throw error;
  }

  return gradient;
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
