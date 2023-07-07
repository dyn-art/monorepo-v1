import { transformToCSS } from '@/components/canvas/utils';
import { TFrameNode } from '@pda/types/dtif';
import React from 'react';
import { Fills } from '../other';
import Rectangle from './Rectangle';

const Frame: React.FC<TProps> = (props) => {
  const { node } = props;
  const clipPathId = `frame-clip-${node.id}`;

  return (
    <g
      id={`frame-${node.id}`}
      style={{ ...transformToCSS(node.relativeTransform) }}
    >
      {/* Frame Content */}
      <g
        id={`frame-content-${node.id}`}
        clipPath={node.clipsContent ? `url(#${clipPathId})` : undefined}
      >
        <Fills node={node} />
        <g id={`frame-children-${node.id}`}>
          {node.children.map((child) => (
            <Rectangle node={child as any} />
          ))}
        </g>
      </g>

      {/* Clips Content */}
      {node.clipsContent && (
        <defs>
          <clipPath id={clipPathId}>
            <rect width={node.width} height={node.height} />
          </clipPath>
        </defs>
      )}
    </g>
  );
};

export default Frame;

type TProps = {
  node: TFrameNode;
};
