import { TPaint } from '@pda/types/dtif';
import { notEmpty } from '@pda/utils';
import {
  TFormatGradientFillOptions,
  TFormatImageFillOptions,
} from '../../types';
import { formatGradientFill } from './format-gradient-fill';
import { formatImageFill } from './format-image-fill';
import { formatSoldFill } from './format-solid-fill';

export async function formatFills(
  node: SceneNode,
  inputFills: Paint[],
  options: {
    gradientFill?: TFormatGradientFillOptions;
    imageFill?: TFormatImageFillOptions;
    tempFrameNode?: FrameNode;
  } = {}
): Promise<TPaint[]> {
  const { gradientFill, imageFill, tempFrameNode } = options;
  const fills = await Promise.all(
    inputFills.map((fill) => {
      if (!fill.visible) return Promise.resolve(null);
      switch (fill.type) {
        case 'GRADIENT_ANGULAR':
        case 'GRADIENT_DIAMOND':
        case 'GRADIENT_LINEAR':
        case 'GRADIENT_RADIAL':
          return formatGradientFill(node, fill, {
            ...gradientFill,
            tempFrameNode,
          });
        case 'IMAGE':
          return formatImageFill(node, fill, imageFill);
        case 'SOLID':
          return Promise.resolve(formatSoldFill(fill));
        default:
          return Promise.resolve(null);
      }
    })
  );
  return fills.filter(notEmpty) as TPaint[];
}
