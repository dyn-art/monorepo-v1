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
  options: TFormatGradientFillOptions['exportOptions'] & {
    tempFrameNode?: FrameNode;
  } = {}
): Promise<TGradientPaintExported> {
  const { uploadStaticData, tempFrameNode } = options;
  let format = options.format ?? 'JPG';
  let gradient: TGradientPaintExported;
  const fillNode = createFillNode(node, [fill], { tempFrameNode });

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
  fills: Paint[],
  config: {
    tempFrameNode?: FrameNode;
  } = {}
): TNodeWithFills {
  const { tempFrameNode } = config;

  const clone = isTextNode(node)
    ? createRectangleNodeFromTextNode(node)
    : node.clone();
  try {
    // Add clone to context frame node so in case of error
    // there are no random temporary nodes flying around in the scene
    if (tempFrameNode != null) {
      tempFrameNode.appendChild(clone);
    }

    // Apply fills to clone
    clone.fills = fills;

    // Reset transform before upload so that the transform is not embedded into the SVG
    resetNodeTransform(clone);
  } catch (error) {
    clone.remove();
    throw error;
  }

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
