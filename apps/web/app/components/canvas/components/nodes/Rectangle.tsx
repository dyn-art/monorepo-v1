import { getIdentifier, transformToCSS } from '@/components/canvas/utils';
import { TRectangleNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';

const Rectangle: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;
  const fillClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'rectangle',
        category: 'fill-clip',
        isDefinition: true,
      }),
    [node.id]
  );
  const svgPath = React.useMemo(
    () =>
      createSVGPath({
        width: node.width,
        height: node.height,
        topLeftRadius: node.topLeftRadius,
        topRightRadius: node.topRightRadius,
        bottomRightRadius: node.bottomRightRadius,
        bottomLeftRadius: node.bottomLeftRadius,
      }),
    [
      node.width,
      node.height,
      node.topLeftRadius,
      node.topRightRadius,
      node.bottomRightRadius,
      node.bottomLeftRadius,
    ]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'rectangle',
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

export default Rectangle;

function createSVGPath(props: {
  width: number;
  height: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomRightRadius: number;
  bottomLeftRadius: number;
}): string {
  const {
    width,
    height,
    topLeftRadius,
    topRightRadius,
    bottomRightRadius,
    bottomLeftRadius,
  } = props;
  return [
    `M ${topLeftRadius},0`,
    `h ${width - topRightRadius - topLeftRadius}`,
    `q ${topRightRadius},0 ${topRightRadius},${topRightRadius}`,
    `v ${height - topRightRadius - bottomRightRadius}`,
    `q 0,${bottomRightRadius} -${bottomRightRadius},${bottomRightRadius}`,
    `h -${width - bottomRightRadius - bottomLeftRadius}`,
    `q -${bottomLeftRadius},0 -${bottomLeftRadius},-${bottomLeftRadius}`,
    `v -${height - bottomLeftRadius - topLeftRadius}`,
    `q 0,-${topLeftRadius} ${topLeftRadius},-${topLeftRadius}`,
    'Z',
  ].join(' ');
}

type TProps = {
  node: TRectangleNode;
  index?: number;
};
