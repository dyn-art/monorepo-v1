import {
  createStarPath,
  getIdentifier,
  transformToCSS,
} from '@/components/canvas/utils';
import { TStarNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';

const Star: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;
  const fillClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'star',
        category: 'fill-clip',
        isDefinition: true,
      }),
    [node.id]
  );
  const svgPath = React.useMemo(
    () =>
      createStarPath({
        width: node.width,
        height: node.height,
        pointCount: node.pointCount,
        innerRadiusRatio: node.innerRadiusRation,
      }),
    [node.width, node.height, node.pointCount, node.innerRadiusRation]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'star',
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

export default Star;

type TProps = {
  node: TStarNode;
  index?: number;
};
