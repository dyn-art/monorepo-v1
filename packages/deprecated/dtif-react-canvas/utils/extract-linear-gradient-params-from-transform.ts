import { TTransform, TVector } from '@dyn/types/dtif';
import matrixInverse from 'matrix-inverse';
import { applyMatrixToPoint } from './apply-matrix-to-point';

/**
 * Helper function to extract the x and y positions of the start and end of the linear gradient
 * (scale is not important here).
 *
 * Credits:
 * https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/tree/master
 */
export function extractLinearGradientParamsFromTransform(
  shapeWidth: number,
  shapeHeight: number,
  transform: TTransform
): { start: TVector; end: TVector } {
  const mxInv = matrixInverse(transform);
  const startEnd = [
    [0, 0.5],
    [1, 0.5],
  ].map((p) => applyMatrixToPoint(mxInv, p));
  return {
    start: { x: startEnd[0][0] * shapeWidth, y: startEnd[0][1] * shapeHeight },
    end: { x: startEnd[1][0] * shapeWidth, y: startEnd[1][1] * shapeHeight },
  };
}
