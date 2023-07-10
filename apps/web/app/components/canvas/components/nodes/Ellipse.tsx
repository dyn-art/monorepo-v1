import {
  createEllipsePath,
  getIdentifier,
  transformToCSS,
} from '@/components/canvas/utils';
import { TEllipseNode } from '@pda/types/dtif';
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
      createEllipsePath({
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
          <path d={svgPath} fill={'red'} />
        </clipPath>
      </defs>
      <Fill node={node} clipPathId={fillClipPathId} />
    </g>
  );
};

export default Ellipse;

type TProps = {
  node: TEllipseNode;
  index?: number;
};
