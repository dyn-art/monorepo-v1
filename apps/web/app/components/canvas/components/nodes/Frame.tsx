import { TFrameNode } from '@pda/types/dtif';
import React from 'react';
import { Fills } from '../other';
import { transformToCSS } from '../utils';
import Rectangle from './Rectangle';

const Frame: React.FC<TProps> = (props) => {
  const { node } = props;
  const clipPathId = `frame-clip-${node.id}`;

  const frameProps = {
    width: node.width,
    height: node.height,
    style: { ...transformToCSS(node.relativeTransform) },
  };

  return (
    <g id={`frame-${node.id}`} {...frameProps}>
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
            <rect {...frameProps} />
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
