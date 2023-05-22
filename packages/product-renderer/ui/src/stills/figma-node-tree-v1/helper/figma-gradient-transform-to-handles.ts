import * as math from 'mathjs';
import { TPoint } from './types';

const identityMatrixHandlePositions = [
  [0, 1, 0],
  [0.5, 0.5, 1],
  [1, 1, 1],
];

/**
 * Helper function to convert Figma's gradient transform matrix into gradient handle positions.
 *
 * The function requires a 2x3 or 3x3 matrix input. If a 2x3 matrix is provided,
 * it is converted into a 3x3 matrix by adding an extra row [0, 0, 1].
 *
 * The function returns null if the input matrix has less than 2 rows. Otherwise,
 * it returns an array of objects representing handle positions.
 *
 * Based on: https://gist.github.com/yagudaev/0c2b89674c6aee8b38cd379752ef58d0#file-setpropertyfill-ts
 *
 * @param transform - The gradient transform matrix from Figma.
 * @returns An array of gradient handle positions, or null.
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
