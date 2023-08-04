import { TTransform, TVector } from '@pda/types/dtif';
import matrixInverse from 'matrix-inverse';
import { applyMatrixToPoint } from './apply-matrix-to-point';

/**
 * Helper function to extract the rotation (in degrees),
 * center point and radius for a radial or diamond gradient
 *
 * Credits:
 * https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/tree/master
 */
export function extractRadialOrDiamondGradientParams(
  shapeWidth: number,
  shapeHeight: number,
  transform: TTransform
): { rotation: number; center: TVector; radius: TVector } {
  const mxInv = matrixInverse(transform);
  const centerPoint = applyMatrixToPoint(mxInv, [0.5, 0.5]);
  const rxPoint = applyMatrixToPoint(mxInv, [1, 0.5]);
  const ryPoint = applyMatrixToPoint(mxInv, [0.5, 1]);
  const rx = Math.sqrt(
    Math.pow(rxPoint[0] - centerPoint[0], 2) +
      Math.pow(rxPoint[1] - centerPoint[1], 2)
  );
  const ry = Math.sqrt(
    Math.pow(ryPoint[0] - centerPoint[0], 2) +
      Math.pow(ryPoint[1] - centerPoint[1], 2)
  );
  const angle =
    Math.atan((rxPoint[1] - centerPoint[1]) / (rxPoint[0] - centerPoint[0])) *
    (180 / Math.PI);
  return {
    rotation: angle,
    center: { x: centerPoint[0] * shapeWidth, y: centerPoint[1] * shapeHeight },
    radius: { x: rx * shapeWidth, y: ry * shapeHeight },
  };
}
