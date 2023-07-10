import { TEllipseArcData, TVector } from '@pda/types/dtif';
import { notEmpty } from '@pda/utils';

/**
 * Constructs a SVG path string based on the given arc data and ellipse width & height.
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
  const { startingAngle, endingAngle, innerRadius } = arcData;

  // Calculate radius of ellipse
  const rx = width / 2;
  const ry = height / 2;

  const g = getSvgArcPath({
    center: { x: rx, y: ry },
    startAngle: startingAngle,
    endAngle: endingAngle,
    radius: {
      x: rx,
      y: ry,
    },
    innerRadius,
  });

  return g.join(' ');
}

// Helper function to construct the SVG path string of an ellipse
function getSvgArcPath(props: {
  center: TVector;
  startAngle: number; // In radian
  endAngle: number; // In radian
  radius: { x: number; y: number };
  innerRadius?: number; // In percent (0 - 1) to the outer radius
}): string[] {
  const {
    center: { x: cx, y: cy },
    startAngle,
    endAngle,
    radius: { x: rx, y: ry },
    innerRadius = 0,
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

  // Calculate start and end coordinates on the boundary of the inner ellipse
  let innerStart: TVector = { x: cx, y: cy };
  let innerEnd: TVector = { x: cx, y: cy };
  if (innerRadius > 0) {
    innerStart = {
      x: cx + Math.cos(startAngle) * innerRadius * rx,
      y: cy + Math.sin(startAngle) * innerRadius * ry,
    };
    innerEnd = {
      x: cx + Math.cos(endAngle) * innerRadius * rx,
      y: cy + Math.sin(endAngle) * innerRadius * ry,
    };
  }

  // If the ellipse slice is bigger than 180 degrees (half circle),
  // we have to tell SVG to take the longest route (by default it will take the shortest),
  // which is why the largeArcFlag is set to 1 for a > 180 degrees circle.
  const largeArcFlag = endAngle - startAngle >= Math.PI ? '1' : '0';
  // If the ellipse slice is a full circle (360 degrees),
  // we have to draw the arc in a clockwise direction for it to appear correct to the viewer,
  // which is why the sweepFlagOuter is set to 0 when it's a full circle
  const sweepFlagOuter = endAngle - startAngle >= Math.PI * 2 ? '0' : '1';
  // On the other hand, for the inner arc,
  // drawing in a counter-clockwise direction will ensure the hole
  // in the donut segment is rendered correctly,
  // which is why the sweepFlagInner is set to 1 for a full circle
  const sweepFlagInner = endAngle - startAngle >= Math.PI * 2 ? '1' : '0';

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
    innerRadius > 0
      ? `A ${rx * innerRadius} ${
          ry * innerRadius
        } 0 ${largeArcFlag} ${sweepFlagInner} ${innerStart.x} ${innerStart.y}`
      : null,
    // Close the path
    'Z',
  ].filter(notEmpty);
}
