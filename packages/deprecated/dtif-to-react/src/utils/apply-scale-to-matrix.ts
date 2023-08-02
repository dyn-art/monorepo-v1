import { TTransform } from '@pda/types/dtif';
import * as math from 'mathjs';

export function applyScaleToMatrix(
  matrix: TTransform,
  scale: number
): TTransform {
  // Create the scale matrix
  const scaleMatrix = math.matrix([
    [scale, 0, 0],
    [0, scale, 0],
    [0, 0, 1],
  ]);

  // Multiply the matrices
  return math
    .multiply(math.matrix(matrix), scaleMatrix)
    .toArray() as TTransform;
}
