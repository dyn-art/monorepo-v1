import { TTransform } from '@pda/dtif-types';

export function extractDataFromMatrix(matrix: TTransform): T2DMatrixData {
  // Extract translation values (tx and ty)
  // Extract translation values (tx and ty)
  const tx = matrix[0][2];
  const ty = matrix[1][2];

  // Extract rotation
  const a = matrix[0][0];
  const b = matrix[0][1];
  const rotation = Math.atan2(b, a); // atan2(b, a) gives the rotation in radians

  // Extract scale values (scaleX and scaleY)
  // Use the Euclidean norm (length) of each basis vector
  const scaleX = Math.sqrt(matrix[0][0] ** 2 + matrix[1][0] ** 2);
  const scaleY = Math.sqrt(matrix[0][1] ** 2 + matrix[1][1] ** 2);

  return {
    tx: tx,
    ty: ty,
    scaleX: scaleX,
    scaleY: scaleY,
    rotation: rotation * (180 / Math.PI), // convert rotation from radians to degrees
  };
}

export type T2DMatrixData = {
  tx: number;
  ty: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};
