import { UnsupportedFigmaPaintException } from '@/exceptions';
import { TTransformNodeOptions } from '@/types';
import { TPaint } from '@pda/types/dtif';
import { transformImagePaint } from './transform-image-paint';
import { transformLinearGradientPaint } from './transform-linear-gradient-paint';
import { transformRadialGradientPaint } from './transform-radial-gradient-paint';
import { transformSolidPaint } from './transform-solid-paint';
import { transformToExportedGradientPaint } from './transform-to-exported-gradient-paint';

export async function transformPaint(
  paint: Paint,
  node: SceneNode,
  options: TTransformNodeOptions
): Promise<TPaint> {
  switch (paint.type) {
    case 'SOLID':
      return transformSolidPaint(paint);
    case 'IMAGE':
      return transformImagePaint(paint, node, options.imagePaint);
    case 'GRADIENT_LINEAR':
      return transformLinearGradientPaint(paint, node, options);
    case 'GRADIENT_RADIAL':
      return transformRadialGradientPaint(paint, node, options);
    case 'GRADIENT_ANGULAR':
    case 'GRADIENT_DIAMOND':
      return transformToExportedGradientPaint(paint, node, options);
    default:
      throw new UnsupportedFigmaPaintException(paint, node);
  }
}
