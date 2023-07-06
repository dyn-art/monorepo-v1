import { TSolidPaint } from '@pda/types/dtif';
import { figmaRGBToCss } from '../figma-rgb-to-css';

export function handleSolidFill(fill: TSolidPaint): React.CSSProperties {
  return {
    backgroundColor: figmaRGBToCss(fill.color),
  };
}
