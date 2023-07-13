import { TTransform } from '@pda/types/dtif';
import type { CSSProperties } from 'react';
import { T2DMatrixData, extractMatrixData } from '../math/extract-matrix-data';

export function transformToCSS(
  transform: TTransform | T2DMatrixData
): CSSProperties {
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
