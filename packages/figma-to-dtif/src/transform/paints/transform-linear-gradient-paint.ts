import { convert2DMatrixTo3DMatrix } from '@/helpers';
import { TTransformNodeOptions } from '@/types';
import {
  TGradientPaintExported,
  TLinearGradientPaintInline,
} from '@pda/types/dtif';
import { transformToExportedGradientPaint } from './transform-to-exported-gradient-paint';

export async function transformLinearGradientPaint(
  paint: GradientPaint,
  node: SceneNode,
  options: TTransformNodeOptions = {}
): Promise<TLinearGradientPaintInline | TGradientPaintExported> {
  const { inline = true } = options.gradientPaint ?? {};
  if (!inline) {
    return transformToExportedGradientPaint(paint, node, options);
  } else {
    return {
      type: 'GRADIENT_LINEAR',
      isExported: false,
      blendMode: paint.blendMode ?? 'PASS_THROUGH',
      opacity: paint.opacity ?? 1,
      isVisible: paint.visible ?? true,
      gradientStops: paint.gradientStops,
      transform: convert2DMatrixTo3DMatrix(paint.gradientTransform),
    } as TLinearGradientPaintInline;
  }
}
