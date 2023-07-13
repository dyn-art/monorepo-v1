import { TTransform } from '@pda/types/dtif';

export function extractMatrixData(matrix: TTransform): T2DMatrixData {
  // Extract translation values (tx and ty)
  const tx = matrix[0][2];
  const ty = matrix[1][2];

  // Extract rotation
  const a = matrix[0][0];
  const b = matrix[0][1];
  const rotation = Math.atan2(b, a);

  // Extract scale values (scaleX and scaleY)
  // Use the Euclidean norm (length) of each basis vector
  const scaleX = Math.sqrt(matrix[0][0] ** 2 + matrix[1][0] ** 2);
  const scaleY = Math.sqrt(matrix[0][1] ** 2 + matrix[1][1] ** 2);

  return {
    tx,
    ty,
    scaleX,
    scaleY,
    rotation: rotation * (180 / Math.PI), // Convert rotation from radians to degrees
  };
}

export type T2DMatrixData = {
  tx: number;
  ty: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};
