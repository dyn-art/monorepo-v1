import { TSolidPaint } from '@pda/types/dtif';

export function transformSolidPaint(paint: SolidPaint): TSolidPaint {
  return {
    type: 'SOLID',
    blendMode: paint.blendMode ?? 'PASS_THROUGH',
    color: paint.color,
    opacity: paint.opacity ?? 1,
    isVisible: paint.visible ?? true,
  };
}
