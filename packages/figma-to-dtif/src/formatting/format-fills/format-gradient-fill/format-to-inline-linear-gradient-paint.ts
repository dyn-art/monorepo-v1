import { TLinearGradientPaintInline } from '@pda/types/dtif';
import { convert2DMatrixTo3DMatrix } from '../../../utils';
import { getGradientFillBaseProperties } from './get-gradient-fill-base-properties';

export function formatToInlineLinearGradientPaint(
  fill: GradientPaint
): TLinearGradientPaintInline {
  return {
    gradientStops: fill.gradientStops,
    transform: convert2DMatrixTo3DMatrix(fill.gradientTransform),
    ...getGradientFillBaseProperties(fill),
  } as TLinearGradientPaintInline;
}
