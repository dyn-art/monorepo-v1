import { TPoint } from './types';

/**
 * Helper function to calculate the angle between two points.
 * The angle is calculated counterclockwise from the positive x-axis.
 *
 * @param {TPoint} point1 - The first point.
 * @param {TPoint} point2 - The second point.
 * @returns {number} The angle in degrees, rounded to two decimal places.
 */
export function calculateAngle(point1: TPoint, point2: TPoint): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;

  // Calculate the angle in radians
  const angleInRadians = Math.atan2(dy, dx);

  // Convert the angle to degrees
  let angleInDegrees = angleInRadians * (180 / Math.PI);

  // If the angle is negative, convert it to its equivalent positive angle
  if (angleInDegrees < 0) {
    angleInDegrees = 360 + angleInDegrees;
  }

  // Round the result to two decimal places
  return angleInDegrees;
}
