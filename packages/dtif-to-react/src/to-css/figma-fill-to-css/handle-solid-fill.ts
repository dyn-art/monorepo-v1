import { TSolidPaint } from '@pda/dtif-types';
import { figmaRGBToCss } from '../figma-rgb-to-css';

export function handleSolidFill(fill: TSolidPaint): React.CSSProperties {
  return {
    backgroundColor: figmaRGBToCss(fill.color),
  };
}
