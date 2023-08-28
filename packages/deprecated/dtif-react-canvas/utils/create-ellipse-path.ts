import { TEllipseArcData, TVector } from '@dyn/types/dtif';
import { notEmpty } from '@dyn/utils';

/**
 * Constructs a ellipse SVG path string based on the given arc data
 * and width & height of the ellipse.
 *
 * Good to know: https://dev.to/mustapha/how-to-create-an-interactive-svg-donut-chart-using-angular-19eo
 *
 * @param {Object} props - An object contains the parameters needed.
 * @returns {string} SVG path string.
 */
export function createEllipsePath(props: {
  arcData: TEllipseArcData;
  width: number;
  height: number;
}) {
  const { arcData, width, height } = props;
  const { startingAngle, endingAngle, innerRadiusRatio } = arcData;

  // Calculate radius of ellipse
  const rx = width / 2;
  const ry = height / 2;

  // Create SVG path
  return getSvgArcPath({
    center: { x: rx, y: ry },
    startAngle: startingAngle,
    endAngle: endingAngle,
    radius: {
      x: rx,
      y: ry,
    },
    innerRadiusRatio,
  });
}

// Helper function to construct the SVG path string of an ellipse
function getSvgArcPath(props: {
  center: TVector;
  startAngle: number; // In radian
  endAngle: number; // In radian
  radius: { x: number; y: number };
  innerRadiusRatio?: number; // In percent (0 - 1) to the outer radius
}): string {
  const {
    center: { x: cx, y: cy },
    startAngle,
    endAngle,
    radius: { x: rx, y: ry },
    innerRadiusRatio = 0,
  } = props;

  // Calculate start and end coordinates on the boundary of the outer ellipse
  const outerStart: TVector = {
    x: cx + Math.cos(startAngle) * rx,
    y: cy + Math.sin(startAngle) * ry,
  };
  const outerEnd: TVector = {
    x: cx + Math.cos(endAngle) * rx,
    y: cy + Math.sin(endAngle) * ry,
  };

  // When creating a SVG path for a full circle with an inner radius (creating a "donut" shape),
  // the path starts and ends at the same point on the circle's boundary. However, when the
  // starting and ending angles are exactly the same, the SVG renderer doesn't "know" that it needs
  // to draw a full circle. Instead, it sees this as a zero-length path, and so it doesn't draw anything.
  //
  // By adding a small offset (epsilon) to the ending angle, we ensure that the starting and ending
  // points are slightly different. This "tricks" the SVG renderer into drawing a nearly complete
  // circle, which appears as a full circle due to the small size of the offset.
  //
  // The value of epsilon is chosen to be small enough that the resulting gap in the circle is not
  // visible to the naked eye (0.001 radians is approximately 0.057 degrees), but large enough to
  // ensure that the SVG renderer recognizes the path as a non-zero length path, and therefore
  // draws the expected shape.
  //
  // Note that this solution is a workaround to a known issue with SVG rendering, and may not be
  // necessary if the SVG rendering behavior is changed in future versions of SVG or the rendering engine.
  const epsilon = 0.001;

  // Calculate start and end coordinates on the boundary of the inner ellipse
  let innerStart: TVector = { x: cx, y: cy };
  let innerEnd: TVector = { x: cx, y: cy };
  if (innerRadiusRatio > 0) {
    innerStart = {
      x: cx + Math.cos(startAngle + epsilon) * innerRadiusRatio * rx,
      y: cy + Math.sin(startAngle + epsilon) * innerRadiusRatio * ry,
    };
    innerEnd = {
      x: cx + Math.cos(endAngle + epsilon) * innerRadiusRatio * rx,
      y: cy + Math.sin(endAngle + epsilon) * innerRadiusRatio * ry,
    };
  }

  // If the ellipse slice is bigger than 180 degrees (half circle),
  // we have to tell SVG to take the longest route (by default it will take the shortest),
  // which is why the largeArcFlag is set to 1 for a > 180 degrees circle.
  const largeArcFlag =
    startAngle < 0 || endAngle < 0 || endAngle - startAngle >= Math.PI
      ? '1'
      : '0';
  // If the ellipse slice is a full circle (360 degrees),
  // we have to draw the arc in a clockwise direction for it to appear correct to the viewer,
  // which is why the sweepFlagOuter is set to 0 when it's a full circle
  const sweepFlagOuter =
    startAngle < 0 || endAngle < 0 || endAngle - startAngle >= Math.PI * 2
      ? '0'
      : '1';
  // On the other hand, for the inner arc,
  // drawing in a counter-clockwise direction will ensure the hole
  // in the donut segment is rendered correctly,
  // which is why the sweepFlagInner is set to 1 for a full circle
  const sweepFlagInner =
    startAngle < 0 || endAngle < 0 || endAngle - startAngle >= Math.PI * 2
      ? '1'
      : '0';

  return [
    // Start at the center of the ellipse
    `M ${innerStart.x} ${innerStart.y}`,
    // Draw line to starting point on the boundary of the ellipse
    `L ${outerStart.x} ${outerStart.y}`,
    // Draw the outer arc to the end point on the boundary of the ellipse
    `A ${rx} ${ry} 0 ${largeArcFlag} ${sweepFlagOuter} ${outerEnd.x} ${outerEnd.y}`,
    // Draw back to the center (initial starting point) if no inner radius,
    // if inner radius draw to inner radius end
    `L ${innerEnd.x} ${innerEnd.y}`,
    // If inner radius draw inner radius to the inner start
    innerRadiusRatio > 0
      ? `A ${rx * innerRadiusRatio} ${
          ry * innerRadiusRatio
        } 0 ${largeArcFlag} ${sweepFlagInner} ${innerStart.x} ${innerStart.y}`
      : null,
    // Close the path
    'Z',
  ]
    .filter(notEmpty)
    .join(' ');
}
