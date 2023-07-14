import { TSolidPaint } from '@pda/types/dtif';

export function formatSoldFill(fill: SolidPaint): TSolidPaint {
  return {
    type: 'SOLID',
    blendMode: fill.blendMode ?? 'PASS_THROUGH',
    color: fill.color,
    opacity: fill.opacity ?? 1,
  };
}
