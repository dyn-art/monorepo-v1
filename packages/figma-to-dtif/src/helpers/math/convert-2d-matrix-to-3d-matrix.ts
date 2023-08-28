export function convert2DMatrixTo3DMatrix(matrix2D: T2DMatrix): T3DMatrix {
  return [matrix2D[0], matrix2D[1], [0, 0, 1]];
}

export type T2DMatrix = [[number, number, number], [number, number, number]];
export type T3DMatrix = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];
