import { TPaint } from '@pda/types/dtif';
import {
  TFormatGradientFillOptions,
  TFormatImageFillOptions,
} from '../../types';
import { formatGradientFill } from './format-gradient-fill';
import { formatImageFill } from './format-image-fill';

export async function formatFills(
  node: SceneNode,
  inputFills: Paint[],
  options: {
    gradientFill?: TFormatGradientFillOptions;
    imageFill?: TFormatImageFillOptions;
  } = {}
): Promise<TPaint[]> {
  const fillPromises = inputFills.map((fill) => {
    if (!fill.visible) return Promise.resolve(null);
    switch (fill.type) {
      case 'GRADIENT_ANGULAR':
      case 'GRADIENT_DIAMOND':
      case 'GRADIENT_LINEAR':
      case 'GRADIENT_RADIAL':
        return formatGradientFill(node, fill, options.gradientFill);
      case 'IMAGE':
        return formatImageFill(node, fill, options.imageFill);
      case 'SOLID':
        return Promise.resolve(fill);
      default:
        return Promise.resolve(null);
    }
  });
  const fills = await Promise.all(fillPromises);
  return fills.filter((fill) => fill != null) as TPaint[];
}
