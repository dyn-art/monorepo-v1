import { TVector } from '@pda/types/dtif';

/**
 * Constructs a star SVG path string based on the given point count
 * and width & height of the star.
 *
 * @param {Object} props - An object contains the parameters needed.
 * @returns {string} SVG path string.
 */
export function createStarPath(props: {
  pointCount: number;
  width: number;
  height: number;
  innerRadiusRatio: number; // In percent (0 - 1) to the outer radius
}) {
  const { pointCount, width, height, innerRadiusRatio } = props;

  // Calculate the x and y radii for the outer and inner star polygons
  const radiusX = width / 2;
  const radiusY = height / 2;
  const innerRadiusX = radiusX * innerRadiusRatio;
  const innerRadiusY = radiusY * innerRadiusRatio;

  const points: TVector[] = [];
  const innerPoints: TVector[] = [];

  // Calculate the vertices of the outer and inner polygons
  for (let i = 0; i < pointCount; i++) {
    // The angle for each vertex, starting from -90 degrees (upwards direction)
    const angle = ((2 * Math.PI) / pointCount) * i - Math.PI / 2;

    // Calculate and store the vertex on the outer polygon
    const x = radiusX + radiusX * Math.cos(angle);
    const y = radiusY + radiusY * Math.sin(angle);
    points.push({ x, y });

    // Calculate and store the corresponding vertex on the inner polygon
    const innerAngle = angle + Math.PI / pointCount;
    const innerX = radiusX + innerRadiusX * Math.cos(innerAngle);
    const innerY = radiusY + innerRadiusY * Math.sin(innerAngle);
    innerPoints.push({ x: innerX, y: innerY });
  }

  // Start the path at the first vertex of the outer polygon
  const g = [`M ${points[0].x},${points[0].y}`];

  // Draw lines between the vertices of the outer and inner polygons
  for (let i = 0; i < points.length; i++) {
    // Draw a line from the current outer vertex to the corresponding inner vertex
    g.push(`L ${innerPoints[i].x},${innerPoints[i].y}`);
    // Draw a line from the current inner vertex to the next outer vertex
    g.push(
      `L ${points[(i + 1) % points.length].x},${
        points[(i + 1) % points.length].y
      }`
    );
  }

  // Close the path
  g.push('Z');

  return g.join(' ');
}
