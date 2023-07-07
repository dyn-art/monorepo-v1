import { transformToCSS } from '@/components/canvas/utils';
import { TRectangleNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';

const Rectangle: React.FC<TProps> = (props) => {
  const { node } = props;
  const fillClipPathId = `rectangle_fill-clip-${node.id}`;

  return (
    <g
      id={`rectangle-${node.id}`}
      style={{
        display: node.isVisible ? 'block' : 'none',
        borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
        ...transformToCSS(node.relativeTransform),
      }}
    >
      <defs>
        <clipPath id={fillClipPathId}>
          <rect width={node.width} height={node.height} />
        </clipPath>
      </defs>
      <Fill node={node} clipPathId={fillClipPathId} />
    </g>
  );
};

export default Rectangle;

type TProps = {
  node: TRectangleNode;
};
