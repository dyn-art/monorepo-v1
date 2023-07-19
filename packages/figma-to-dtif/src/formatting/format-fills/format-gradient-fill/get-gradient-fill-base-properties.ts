import { TGradientPaint } from '@pda/types/dtif';

export function getGradientFillBaseProperties(
  fill: GradientPaint
): Partial<TGradientPaint> {
  return {
    type: fill.type,
    blendMode: fill.blendMode ?? 'PASS_THROUGH',
    opacity: fill.opacity ?? 1,
    isVisible: fill.visible ?? true,
  };
}
