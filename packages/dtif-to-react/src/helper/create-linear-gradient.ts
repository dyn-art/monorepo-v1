import { TColorStop, TGradientPaint, TNode } from '@pda/dtif-types';
import { figmaRGBToCss } from '../to-css';
import { TPoint } from '../types';
import { calculateAngle } from './calculate-angle';
import { figmaGradientTransformToHandles } from './figma-gradient-transform-to-handles';
import { findIntersectionPoint } from './find-intersection-point';
import { getCornersOfNode } from './get-corners-of-node';
import { getGradientPoints } from './get-radiant-points';
import { rotate } from './rotate';
import { rotateEllipse } from './rotate-ellipse';

/**
 * Create a CSS linear gradient based on fill data and component's attributes.
 *
 * Based on: https://github.com/Nushaine/calculateLinearGradient-FigmaAPI/blob/main/linearGradient.ts
 * This code is strongly based on the above linked open source repo.
 * I mainly copied & pasted the code but did a small refactoring
 * however I didn't take the time to fully understand the code
 * and fix issues like related to rotation and stuff
 * as I've decided that the priority lies somewhere else for now.
 * TODO: Understand code 100% and fix edge cases and bugs like in complex rotation
 *
 * @param {TFill} fill - The fill data containing gradient information.
 * @param {TNode} node - The component data containing size, rotation and other relevant data.
 * @returns {string} The resulting CSS linear gradient.
 */
export function createLinearGradient(
  fill: TGradientPaint,
  node: TNode
): string {
  const gradientHandlePositions = figmaGradientTransformToHandles(
    fill.gradientTransform
  );
  if (gradientHandlePositions == null) {
    throw new Error(
      'Failed to convert gradient transform to gradient handles!'
    );
  }

  // Calculate gradient angle
  const gradientAngle = calculateAngle(
    gradientHandlePositions[2],
    gradientHandlePositions[0]
  );

  // Calculate line change in x, y direction based on gradient handle positions and component size
  const lineChangePoint: TPoint = {
    x:
      (gradientHandlePositions[1].x - gradientHandlePositions[0].x) *
      node.width,
    y:
      (1 - gradientHandlePositions[1].y - (1 - gradientHandlePositions[0].y)) *
      node.height,
  };

  const currentLineSize = Math.sqrt(
    lineChangePoint.x ** 2 + lineChangePoint.y ** 2
  );

  // Define desired length of the gradient line and calculate scale factor
  const desiredLength = ((node.width + node.height) / 2) * 4;
  const scaleFactor = (desiredLength - currentLineSize) / 2 / currentLineSize;

  // Calculate element rotation
  const nodeRotate = -Math.acos(node.transform[0][0]) * (180 / Math.PI);

  // Determine the corners of the element
  const nodeCorners = getCornersOfNode(node, nodeRotate);

  // Calculate the endpoints of the scaled arbitrary gradient line
  const scaledArbGradientLine: TPoint[] = [
    getGradientPoints(
      nodeCorners.topLeft,
      {
        x:
          gradientHandlePositions[0].x * node.width -
          scaleFactor * lineChangePoint.x,
        y:
          gradientHandlePositions[0].y * node.height +
          scaleFactor * lineChangePoint.y,
      },
      nodeRotate
    ),
    getGradientPoints(
      nodeCorners.topLeft,
      {
        x:
          gradientHandlePositions[1].x * node.width +
          scaleFactor * lineChangePoint.x,
        y:
          gradientHandlePositions[1].y * node.height -
          scaleFactor * lineChangePoint.y,
      },
      nodeRotate
    ),
  ];

  // Decide which corners to use based on gradient angle
  const centers = {
    top:
      (gradientAngle > 90 && gradientAngle <= 180) ||
      (gradientAngle > 270 && gradientAngle <= 360)
        ? nodeCorners.topLeft
        : nodeCorners.topRight,
    bottom:
      (gradientAngle >= 0 && gradientAngle <= 90) ||
      (gradientAngle > 180 && gradientAngle <= 270)
        ? nodeCorners.bottomLeft
        : nodeCorners.bottomRight,
  };

  // Create perpendicular lines
  const perpLines = createPerpendicularLines(
    node,
    centers,
    nodeRotate,
    desiredLength,
    gradientAngle
  );

  // Calculating relevant portion of gradient line (the actual gradient line -> taking POI of perpendicular lines w/ arbitrary gradient line)
  const topLineIntersection = findIntersectionPoint(
    perpLines.top[0],
    perpLines.top[1],
    scaledArbGradientLine[0],
    scaledArbGradientLine[1]
  );
  const bottomLineIntersection = findIntersectionPoint(
    perpLines.bottom[0],
    perpLines.bottom[1],
    scaledArbGradientLine[0],
    scaledArbGradientLine[1]
  );
  const gradientLine = {
    topCoords: topLineIntersection,
    bottomCoords: bottomLineIntersection,
  };

  // const startEndPosition = extractLinearGradientParamsFromTransform(
  //   node.width,
  //   node.height,
  //   fill.gradientTransform
  // );
  // const gradientLine = {
  //   topCoords: { x: startEndPosition.start[0], y: startEndPosition.start[1] },
  //   bottomCoords: { x: startEndPosition.end[0], y: startEndPosition.end[1] },
  // };

  // Calculate gradient line distance
  const gradientLineDistance = Math.sqrt(
    (gradientLine.bottomCoords.y - gradientLine.topCoords.y) ** 2 +
      (gradientLine.bottomCoords.x - gradientLine.topCoords.x) ** 2
  );

  const absoluteStartingPoint = getGradientPoints(
    nodeCorners.topLeft,
    {
      x: gradientHandlePositions[0].x * node.width,
      y: gradientHandlePositions[0].y * node.height,
    },
    nodeRotate
  );

  // Assemble color stops
  const colors = fill.gradientStops.map((color) =>
    createColorStopString(
      color,
      gradientHandlePositions,
      gradientLine,
      lineChangePoint,
      absoluteStartingPoint,
      gradientLineDistance
    )
  );

  // Assemble and return the final gradient string
  return `linear-gradient(${
    Math.round(gradientAngle * 100) / 100
  }deg, ${colors.join(', ')})`;
}

function createPerpendicularLines(
  node: TNode,
  centers: { top: TPoint; bottom: TPoint },
  nodeRotate: number,
  desiredLength: number,
  gradientAngle: number
) {
  const topLine = [
    rotate(
      { x: centers.top.x, y: centers.top.y },
      { x: centers.top.x - desiredLength / 2, y: centers.top.y },
      nodeRotate
    ),
    rotate(
      { x: centers.top.x, y: centers.top.y },
      { x: centers.top.x + desiredLength / 2, y: centers.top.y },
      nodeRotate
    ),
  ];
  const rotatedTopLine = [
    rotateEllipse(
      { x: centers.top.x, y: centers.top.y },
      centers.top.x - topLine[0].x,
      (centers.top.x - topLine[0].x) * (node.height / node.width),
      gradientAngle,
      nodeRotate
    ),
    rotateEllipse(
      { x: centers.top.x, y: centers.top.y },
      centers.top.x - topLine[1].x,
      (centers.top.x - topLine[1].x) * (node.height / node.width),
      gradientAngle,
      nodeRotate
    ),
  ];
  const bottomLine = [
    rotate(
      { x: centers.bottom.x, y: centers.bottom.y },
      { x: centers.bottom.x - desiredLength / 2, y: centers.bottom.y },
      nodeRotate
    ),
    rotate(
      { x: centers.bottom.x, y: centers.bottom.y },
      { x: centers.bottom.x + desiredLength / 2, y: centers.bottom.y },
      nodeRotate
    ),
  ];
  const rotatedBottomLine = [
    rotateEllipse(
      { x: centers.bottom.x, y: centers.bottom.y },
      centers.bottom.x - bottomLine[0].x,
      (centers.bottom.x - bottomLine[0].x) * (node.height / node.width),
      gradientAngle,
      nodeRotate
    ),
    rotateEllipse(
      { x: centers.bottom.x, y: centers.bottom.y },
      centers.bottom.x - bottomLine[1].x,
      (centers.bottom.x - bottomLine[1].x) * (node.height / node.width),
      gradientAngle,
      nodeRotate
    ),
  ];

  return { top: rotatedTopLine, bottom: rotatedBottomLine };
}

function createColorStopString(
  color: TColorStop,
  gradientHandlePositions: TPoint[],
  gradientLine: { topCoords: TPoint; bottomCoords: TPoint },
  lineChangePoint: TPoint,
  absoluteStartingPoint: TPoint,
  gradientLineDistance: number
): string {
  let gradientStartPoint = { x: 0, y: 0 };
  if (gradientHandlePositions[0].y < gradientHandlePositions[1].y) {
    gradientStartPoint =
      gradientLine.topCoords.y < gradientLine.bottomCoords.y
        ? gradientLine.topCoords
        : gradientLine.bottomCoords;
  } else {
    gradientStartPoint =
      gradientLine.topCoords.y > gradientLine.bottomCoords.y
        ? gradientLine.topCoords
        : gradientLine.bottomCoords;
    // TODO: horizontal & vertical lines
  }

  const colorX = color.position * lineChangePoint.x + absoluteStartingPoint.x;
  const colorY = absoluteStartingPoint.y - color.position * lineChangePoint.y;
  const colorDistance = Math.sqrt(
    (colorY - gradientStartPoint.y) ** 2 + (colorX - gradientStartPoint.x) ** 2
  );
  const actualPercentage = colorDistance / gradientLineDistance;

  return `${figmaRGBToCss({ ...color.color })} ${
    Math.round(actualPercentage * 10000) / 100
  }%`;
}
