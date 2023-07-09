import { getIdentifier, transformToCSS } from '@/components/canvas/utils';
import { TEllipseArcData, TEllipseNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';

const Ellipse: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;
  const fillClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'ellipse',
        category: 'fill-clip',
        isDefinition: true,
      }),
    [node.id]
  );
  const svgPath = React.useMemo(
    () =>
      createSVGPath({
        arcData: node.arcData,
        width: node.width,
        height: node.height,
      }),
    [node.arcData, node.width, node.height]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'ellipse',
      })}
      style={{
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
        ...transformToCSS(node.relativeTransform),
      }}
    >
      <defs>
        <clipPath id={fillClipPathId}>
          <path d={svgPath} />
        </clipPath>
      </defs>
      <Fill node={node} clipPathId={fillClipPathId} />
    </g>
  );
};

export default Ellipse;

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadians: number
) {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians), // notice the minus here, SVG's y axis points downwards
  };
}

function describeArc(
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number,
  sweepFlag: number
) {
  const start = polarToCartesian(x, y, radiusX, startAngle);
  const end = polarToCartesian(x, y, radiusY, endAngle);

  const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radiusX,
    radiusY,
    0,
    largeArcFlag,
    sweepFlag,
    end.x,
    end.y,
  ].join(' ');

  return d;
}

function createSVGPath(props: {
  arcData: TEllipseArcData;
  width: number;
  height: number;
}) {
  const { arcData, width, height } = props;
  const { startingAngle, endingAngle, innerRadius } = arcData;

  // Convert angles from mathematical convention to SVG's convention
  const startingAngleSVG = 2 * Math.PI - startingAngle;
  const endingAngleSVG = 2 * Math.PI - endingAngle;

  const largeArcFlag =
    Math.abs(endingAngleSVG - startingAngleSVG) <= Math.PI ? '0' : '1';

  const sweepFlagOuter = '1'; // counter-clockwise for outer arc
  const sweepFlagInner = '0'; // clockwise for inner arc

  const innerRx = (width / 2) * innerRadius;
  const innerRy = (height / 2) * innerRadius;

  const outerRx = width / 2;
  const outerRy = height / 2;

  const centerX = width / 2;
  const centerY = height / 2;

  const startXInner = centerX + innerRx * Math.cos(startingAngleSVG);
  const startYInner = centerY - innerRy * Math.sin(startingAngleSVG);

  const endXInner = centerX + innerRx * Math.cos(endingAngleSVG);
  const endYInner = centerY - innerRy * Math.sin(endingAngleSVG);

  const startXOuter = centerX + outerRx * Math.cos(startingAngleSVG);
  const startYOuter = centerY - outerRy * Math.sin(startingAngleSVG);

  const endXOuter = centerX + outerRx * Math.cos(endingAngleSVG);
  const endYOuter = centerY - outerRy * Math.sin(endingAngleSVG);

  const d = [
    `M ${startXOuter} ${startYOuter}`,
    `A ${outerRx} ${outerRy} 0 ${largeArcFlag} ${sweepFlagOuter} ${endXOuter} ${endYOuter}`,
    `L ${endXInner} ${endYInner}`,
    `A ${innerRx} ${innerRy} 0 ${largeArcFlag} ${sweepFlagInner} ${startXInner} ${startYInner}`,
    `L ${startXOuter} ${startYOuter}`,
    'Z',
  ].join(' ');

  return d;
}

type TProps = {
  node: TEllipseNode;
  index?: number;
};
