import {
  createPolygonPath,
  getIdentifier,
  transformToCSS,
} from '@/components/canvas/utils';
import { TPolygonNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';

const Polygon: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;
  const fillClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'polygon',
        category: 'fill-clip',
        isDefinition: true,
      }),
    [node.id]
  );
  const svgPath = React.useMemo(
    () =>
      createPolygonPath({
        width: node.width,
        height: node.height,
        pointCount: node.pointCount,
      }),
    [node.width, node.height, node.pointCount]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'polygon',
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

export default Polygon;

type TProps = {
  node: TPolygonNode;
  index?: number;
};
