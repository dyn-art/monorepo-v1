import * as math from 'mathjs';
import { TPoint } from './types';

const identityMatrixHandlePositions = [
  [0, 1, 0],
  [0.5, 0.5, 1],
  [1, 1, 1],
];

/**
 * Helper function to convert the gradient Figma transform array to Figma gradient handles.
 */
export function figmaGradientTransformToHandles(
  transform: number[][]
): TPoint[] | null {
  if (transform.length < 2) return null;

  // Ensure transform is a 3x3 matrix
  if (transform.length === 2) {
    transform.push([0, 0, 1]);
  }

  // Invert the transform matrix
  const invertedTransform = math.inv(transform);

  // Multiply the inverted transform with the identity matrix handle positions
  const resultMatrix = math.multiply(
    invertedTransform,
    identityMatrixHandlePositions
  );

  return [
    { x: resultMatrix[0][0], y: resultMatrix[1][0] },
    { x: resultMatrix[0][1], y: resultMatrix[1][1] },
    { x: resultMatrix[0][2], y: resultMatrix[1][2] },
  ];
}
