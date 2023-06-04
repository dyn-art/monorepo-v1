import { TPoint } from '../types';

/**
 * Helper function to calculates the intersection point of two lines.
 * Each line is defined by two points.
 *
 * https://dirask.com/posts/JavaScript-how-to-calculate-intersection-point-of-two-lines-for-given-4-points-VjvnAj
 *
 * @param  p1 - First point of the first line.
 * @param  p2 - Second point of the first line.
 * @param  p3 - First point of the second line.
 * @param  p4 - Second point of the second line.
 * @throws If the lines are parallel (do not intersect).
 * @returns The intersection point of the two lines.
 */
export function findIntersectionPoint(
  p1: TPoint,
  p2: TPoint,
  p3: TPoint,
  p4: TPoint
): TPoint {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: x3, y: y3 } = p3;
  const { x: x4, y: y4 } = p4;

  // Calculate denominators used in intersection point formula
  const d1 = (x1 - x2) * (y3 - y4);
  const d2 = (y1 - y2) * (x3 - x4);
  const d = d1 - d2;

  // Check if the lines are parallel (denominator is zero)
  if (d === 0) {
    throw new Error('Lines are parallel and do not intersect.');
  }

  // Calculate numerators used in intersection point formula
  const u1 = x1 * y2 - y1 * x2;
  const u2 = x3 * y4 - y3 * x4;

  // Calculate the intersection point
  const px = (u1 * (x3 - x4) - (x1 - x2) * u2) / d;
  const py = (u1 * (y3 - y4) - (y1 - y2) * u2) / d;

  // Return the intersection point rounded to 2 decimal places
  return { x: px, y: py };
}
