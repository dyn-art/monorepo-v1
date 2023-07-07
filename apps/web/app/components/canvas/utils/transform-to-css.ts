import { TTransform } from '@pda/types/dtif';
import { extractMatrixData } from './extract-matrix-data';

export function transformToCSS(transform: TTransform): React.CSSProperties {
  const {
    rotation,
    scaleX,
    scaleY,
    tx: x,
    ty: y,
  } = Array.isArray(transform) ? extractMatrixData(transform) : transform;

  return {
    transform: `translate(${x}px, ${y}px) rotate(${
      // We negate the rotation to correct for Figma's clockwise rotation
      -rotation
    }deg) scale(${scaleX}, ${scaleY})`,
    transformOrigin: '0 0', // top left
  };
}
