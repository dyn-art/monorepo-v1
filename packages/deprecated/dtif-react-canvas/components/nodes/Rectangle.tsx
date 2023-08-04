import {
  createRectanglePath,
  getIdentifier,
  transformToCSS,
} from '@/components/canvas/utils';
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
      createRectanglePath({
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

type TProps = {
  node: TRectangleNode;
  index?: number;
};
