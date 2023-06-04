import { TPoint } from '../types';

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
  const angleInRadians = Math.atan(dy / dx);

  // Convert the angle to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  // Calculate angle
  let angle = angleInDegrees;

  // Adjusts the angle based on the quadrant of the line.
  if (point1.x < point2.x) {
    angle = angle + 180; // In quad 2 & 3
  } else if (point1.x > point2.x) {
    if (point1.y < point2.y) {
      angle = 360 - Math.abs(angle); // In quad 4
    }
  }
  // If the line is vertical, adjust based on whether it's pointing up or down.
  else if (point1.x == point2.x) {
    // horizontal line
    if (point1.y < point2.y) {
      angle = 360 - Math.abs(angle); // On negative y-axis
    } else {
      angle = Math.abs(angle); // On positive y-axis
    }
  }

  return angle;
}
