import { TGradientPaint } from '@pda/types/dtif';
import { TFormatGradientFillOptions } from '../../../types';
import { isNodeWithFills } from '../../../utils';
import { formatToExportedGradientPaint } from './format-to-exported-gradient-paint';
import { formatToInlineLinearGradientPaint } from './format-to-inline-linear-gradient-paint';
import { formatToInlineRadialGradientPaint } from './format-to-inline-radial-gradient-paint';

export async function formatGradientFill(
  node: SceneNode,
  fill: GradientPaint,
  options: TFormatGradientFillOptions = {}
): Promise<TGradientPaint | null> {
  if (!isNodeWithFills(node) || node.fills === figma.mixed) {
    return null;
  }

  switch (fill.type) {
    case 'GRADIENT_LINEAR':
      return options.inline
        ? formatToInlineLinearGradientPaint(fill)
        : formatToExportedGradientPaint(node, fill, options.exportOptions);
    case 'GRADIENT_RADIAL':
      return options.inline
        ? formatToInlineRadialGradientPaint(fill)
        : formatToExportedGradientPaint(node, fill, options.exportOptions);
    case 'GRADIENT_ANGULAR':
      return formatToExportedGradientPaint(node, fill, options.exportOptions);
    case 'GRADIENT_DIAMOND':
      return formatToExportedGradientPaint(node, fill, options.exportOptions);
    default:
    // do nothing
  }

  return null;
}
