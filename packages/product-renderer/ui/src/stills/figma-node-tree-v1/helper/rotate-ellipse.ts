import { TPoint } from './types';

/**
 * Helper function to rotate an ellipse around a center point by a specific angle.
 *
 * Rotated ellipse equation: https://www.desmos.com/calculator/aqlhivzbvs
 * Good explanation about ellipse parametric equations: https://www.mathopenref.com/coordparamellipse.html
 * Good explanation of rotated parametric ellipse equations: https://math.stackexchange.com/questions/941490/whats-the-parametric-equation-for-the-general-form-of-an-ellipse-rotated-by-any?noredirect=1&lq=1&newreg=fd8890e3dad245b0b6a0f182ba22f7f3
 *
 * @param center - The center point for the rotation.
 * @param xRadius - The x radius of the ellipse.
 * @param yRadius - The y radius of the ellipse.
 * @param angle - The angle in degrees to rotate the point by.
 * @param rotationFactor - The rotation factor for the ellipse.
 * @returns The new coordinates of the ellipse after rotation.
 */
export function rotateEllipse(
  center: TPoint,
  xRadius: number,
  yRadius: number,
  angle: number,
  rotationFactor: number
): TPoint {
  // Increase the radius of the ellipse by 1.5 times
  xRadius *= 1.5;
  yRadius *= 1.5;

  // Normalize the rotation factor from degrees to radians for trigonometric calculations
  const normalizedRotationFactor = rotationFactor / 57.29577951;

  // Calculate the cosine and sine of the (angle + 180) in radians for rotation calculations
  const cosAngle = Math.cos((Math.PI / 180) * (angle + 180));
  const sinAngle = Math.sin((Math.PI / 180) * (angle + 180));

  // Calculate the new x and y coordinates for the ellipse after rotation
  // The formulae are derived from the parametric equation of a rotated ellipse
  // x = -rx*cos(t)*cos(a) - ry*sin(t)*sin(a) + cx
  // y = -ry*cos(t)*sin(a) + rx*sin(t)*cos(a) + cy
  const x =
    -xRadius * Math.cos(normalizedRotationFactor) * cosAngle -
    yRadius * Math.sin(normalizedRotationFactor) * sinAngle +
    center.x;
  const y =
    -yRadius * Math.cos(normalizedRotationFactor) * sinAngle +
    xRadius * Math.sin(normalizedRotationFactor) * cosAngle +
    center.y;

  return { x, y };
}
