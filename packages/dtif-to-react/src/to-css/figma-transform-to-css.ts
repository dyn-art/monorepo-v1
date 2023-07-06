import { TTransform } from '@pda/types/dtif';
import React from 'react';
import {
  T2DMatrixData,
  extractMatrixData,
} from '../utils/extract-data-from-matrix';

/**
 * Helper function to convert a Figma transform object into the CSS transform space
 * and return it as equivalent CSS string.
 *
 * @param transform - The transformation properties from Figma node.
 * @param rotate - Optional flag to apply rotation. Default is true.
 * @returns An object representing the CSS properties equivalent to the Figma transform.
 */
export function figmaTransformToCSS(
  transform: TTransform | T2DMatrixData
): React.CSSProperties {
  const {
    rotation,
    scaleX,
    scaleY,
    tx: x,
    ty: y,
  } = Array.isArray(transform) ? extractMatrixData(transform) : transform;

  // The returned CSS transform property applies the calculated translation and rotation
  return {
    transform: `translate(${x}px, ${y}px) rotate(${
      // We negate the rotation to correct for Figma's clockwise rotation
      -rotation
    }deg) scale(${scaleX}, ${scaleY})`,
    transformOrigin: 'top left',
  };
}
