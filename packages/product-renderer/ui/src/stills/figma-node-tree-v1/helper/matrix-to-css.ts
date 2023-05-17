export function matrixToCSS(matrix: number[][]): string {
  const [scaleX, shearY, translateX] = matrix[0];
  const [shearX, scaleY, translateY] = matrix[1];
  return `matrix(${scaleX}, ${shearY}, ${shearX}, ${scaleY}, ${translateX}, ${translateY})`;
}
