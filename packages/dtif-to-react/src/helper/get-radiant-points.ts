import { TPoint } from '../types';
import { rotate } from './rotate';

/**
 * Calculates the absolute coordinates of a point relative to the top left corner of a shape after rotation.
 *
 * @param topLeftCorner - The top left corner of the shape.
 * @param pointRelativeCoords - The relative coordinates of the point to the top left corner of the shape.
 * @param nodeRotate - The angle in degrees to rotate the point by.
 * @returns The absolute coordinates of the point after rotation.
 */
export function getGradientPoints(
  topLeftCorner: TPoint,
  pointRelativeCoords: TPoint,
  nodeRotate: number
): TPoint {
  // Calculate the absolute coordinates of the point before rotation
  const preRotationPoint: TPoint = {
    x: topLeftCorner.x + pointRelativeCoords.x,
    y: topLeftCorner.y + pointRelativeCoords.y,
  };

  // Rotate the point around the top left corner by elemRotate degrees
  const pointAbsoluteCoords = rotate(
    topLeftCorner,
    preRotationPoint,
    nodeRotate
  );

  return pointAbsoluteCoords;
}
