import { TTransform } from '@pda/types/dtif';

export function copyMatrix(matrix: TTransform): TTransform {
  return matrix.map((row) => [...row]) as TTransform;
}
