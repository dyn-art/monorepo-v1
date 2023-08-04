import { TVector } from '@pda/types/dtif';

/**
 * Constructs a polygon SVG path string based on the given point count
 * and width & height of the polygon.
 *
 * @param {Object} props - An object contains the parameters needed.
 * @returns {string} SVG path string.
 */
export function createPolygonPath(props: {
  pointCount: number;
  width: number;
  height: number;
}) {
  const { pointCount, width, height } = props;

  // Calculating the semi-major and semi-minor axes of the ellipse
  const radiusX = width / 2;
  const radiusY = height / 2;

  const points: TVector[] = [];

  // Loop over the number of points in the polygon
  for (let i = 0; i < pointCount; i++) {
    // Calculate the angle from the current index and the total number of points
    const angle = ((2 * Math.PI) / pointCount) * i - Math.PI / 2;

    // Calculate x and y coordinates based on the angle and radii
    // Using an ellipse formula, not a circle
    const x = radiusX + radiusX * Math.cos(angle);
    const y = radiusY + radiusY * Math.sin(angle);

    // Add the calculated point to the points array
    points.push({ x, y });
  }

  // Start the path at the first point coordinates
  const d = [`M ${points[0].x},${points[0].y}`];

  // Loop over the rest of the points and add "L" (Line to) + point coordinates
  for (let i = 1; i < points.length; i++) {
    d.push(`L ${points[i].x},${points[i].y}`);
  }

  // Close the path
  d.push('Z');

  return d.join(' ');
}
