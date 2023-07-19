import { TPaint } from '@pda/types/dtif';

export function formatSoldFill(fill: SolidPaint): TPaint {
  return {
    type: 'SOLID',
    blendMode: fill.blendMode ?? 'PASS_THROUGH',
    color: fill.color,
    opacity: fill.opacity ?? 1,
    isVisible: fill.visible ?? true,
  };
}
