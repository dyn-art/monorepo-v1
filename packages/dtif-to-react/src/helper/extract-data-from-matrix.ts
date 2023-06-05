import * as math from 'mathjs';

export function extractDataFromMatrix(matrix: math.Matrix): {
  tx: number;
  ty: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
} {
  // Get matrix values
  const matrixValues = matrix.toArray();

  // Extract translation values (tx and ty)
  // (tx, ty) are the third elements in each row of the 2D transformation matrix
  const tx = matrixValues[0][2];
  const ty = matrixValues[1][2];

  // Extract scale and rotation values
  const a = matrixValues[0][0];
  const b = matrixValues[1][0];
  const d = matrixValues[1][1];

  // Calculate scaleX
  // We calculate scaleX as sqrt(a*a + b*b), the Euclidean distance (L2 norm), assuming 'a' and 'b' form a 2D vector.
  const scaleX = Math.sqrt(a * a + b * b);

  // Calculate scaleY
  // scaleY is calculated as d / cos(Math.atan2(b, a)). Here we first calculate the rotation angle as Math.atan2(b, a), then divide 'd' by the cosine of this angle to get scaleY.
  const scaleY = d / Math.cos(Math.atan2(b, a));

  // Calculate rotation
  // The rotation angle is calculated as Math.atan2(b, a), which is the angle between the positive x-axis and the point given by the coordinates (a, b).
  const rotation = Math.atan2(b, a) * (180 / Math.PI); // Convert the rotation from radians to degrees

  return { tx, ty, scaleX, scaleY, rotation };
}
