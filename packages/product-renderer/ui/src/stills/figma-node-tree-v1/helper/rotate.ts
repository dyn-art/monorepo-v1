import { TPoint } from './types';

/**
 * Helper function to rotate a point around a center point by a specific angle.
 *
 * @param center - The center point for the rotation.
 * @param point - The point to rotate.
 * @param angle - The angle in degrees to rotate the point by.
 * @returns The new coordinates of the point after rotation.
 */
export function rotate(center: TPoint, point: TPoint, angle: number): TPoint {
  // Convert angle from degrees to radians for trigonometric operations
  const radians = (Math.PI / 180) * angle;

  // Calculate cosine and sine of the angle for rotation calculations
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  // Calculate the new x and y coordinates for the point after rotation
  // Formula derived from rotation matrix transformation
  // nx = cos(theta) * (x - cx) + sin(theta) * (y - cy) + cx
  // ny = cos(theta) * (y - cy) - sin(theta) * (x - cx) + cy
  const nx = cos * (point.x - center.x) + sin * (point.y - center.y) + center.x;
  const ny = cos * (point.y - center.y) - sin * (point.x - center.x) + center.y;

  return { x: nx, y: ny };
}
