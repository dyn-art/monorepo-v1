import { TSolidPaint } from '@pda/types/dtif';
import { rgbToCSS } from '../../utils';

export function handleSolidFill(fill: TSolidPaint): React.CSSProperties {
  return {
    fill: rgbToCSS(fill.color),
  };
}
