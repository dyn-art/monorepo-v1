import { TPaint } from '@pda/dtif-types';
import { TFormatNodeConfig } from '../../formatting/format-root';
import { handleGradientFill } from './handle-gradient-fill';
import { handleImageFill } from './handle-image-fill';

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
