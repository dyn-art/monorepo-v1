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
      <Fill node={node} clipPathId={fillClipPathId} />
      {/* <defs>
        <clipPath id={fillClipPathId}> */}
      <path d={svgPath} fill={'red'} />
      {/* </clipPath>
      </defs> */}
      {/* <Fill node={node} clipPathId={fillClipPathId} /> */}
    </g>
  );
};

export default Ellipse;

function createSVGPath(props: {
  arcData: TEllipseArcData;
  width: number;
  height: number;
}) {
  const { arcData, width, height } = props;
  const { startingAngle, endingAngle, innerRadius } = arcData;

  const rx = width / 2;
  const ry = height / 2;

  // If we are drawing a full circle or more, SVG can't handle it directly,
  // we will need to draw 2 separate arcs.
  if (endingAngle - startingAngle >= Math.PI * 2) {
    const firstArc = getSvgArc(
      { x: rx, y: ry },
      startingAngle,
      startingAngle + Math.PI,
      rx,
      ry
    );
    const secondArc = getSvgArc(
      { x: rx, y: ry },
      startingAngle + Math.PI,
      endingAngle,
      rx,
      ry
    );
    return `M ${rx} ${ry} ${firstArc} ${secondArc}`;
  } else {
    const arc = getSvgArc({ x: rx, y: ry }, startingAngle, endingAngle, rx, ry);
    return `M ${rx} ${ry} ${arc}`;
  }
}

interface IPoint {
  x: number;
  y: number;
}

// Calculate the SVG arc given center point, starting angle, ending angle and radius.
function getSvgArc(
  center: IPoint,
  startAngle: number,
  endAngle: number,
  rx: number,
  ry: number
): string {
  const start = {
    x: center.x + Math.cos(startAngle) * rx,
    y: center.y + Math.sin(startAngle) * ry,
  };
  const end = {
    x: center.x + Math.cos(endAngle) * rx,
    y: center.y + Math.sin(endAngle) * ry,
  };

  const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';
  const sweepFlag = '1';

  return `L ${start.x} ${start.y} A ${rx} ${ry} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

type TProps = {
  node: TEllipseNode;
  index?: number;
};
