import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TTransformNodeOptions } from '@/types';
import {
  TGradientPaintExported,
  TRadialGradientPaintInline,
} from '@dyn/types/dtif';
import { transformToExportedGradientPaint } from './transform-to-exported-gradient-paint';

export async function transformRadialGradientPaint(
  paint: GradientPaint,
  node: SceneNode,
  options: TTransformNodeOptions = {}
): Promise<TRadialGradientPaintInline | TGradientPaintExported> {
  const { inline = true } = options.gradientPaint ?? {};
  if (!inline) {
    return transformToExportedGradientPaint(paint, node, options);
  } else {
    return {
      type: 'GRADIENT_RADIAL',
      isExported: false,
      blendMode: paint.blendMode ?? 'PASS_THROUGH',
      opacity: paint.opacity ?? 1,
      isVisible: paint.visible ?? true,
      gradientStops: paint.gradientStops,
      transform: convert2DMatrixTo3DMatrix(paint.gradientTransform),
    } as TRadialGradientPaintInline;
  }
}
