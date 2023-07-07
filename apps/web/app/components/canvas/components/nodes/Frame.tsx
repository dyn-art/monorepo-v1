import { transformToCSS } from '@/components/canvas/utils';
import { TFrameNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';
import Node from './Node';

const Frame: React.FC<TProps> = (props) => {
  const { node } = props;
  const contentClipPathId = `frame_content-clip-${node.id}`;
  const fillClipPathId = `frame_fill-clip-${node.id}`;

  return (
    <g
      id={`frame-${node.id}`}
      style={{ ...transformToCSS(node.relativeTransform) }}
    >
      {/* Frame Content */}
      <g
        id={`frame_content-${node.id}`}
        clipPath={node.clipsContent ? `url(#${contentClipPathId})` : undefined}
      >
        <defs>
          <clipPath id={fillClipPathId}>
            <rect width={node.width} height={node.height} />
          </clipPath>
        </defs>
        <Fill node={node} clipPathId={fillClipPathId} />
        <g id={`frame_children-${node.id}`}>
          {node.children.map((child) => (
            <Node node={child} key={`node-${child.id}`} />
          ))}
        </g>
      </g>

      {/* Clips Content */}
      {node.clipsContent && (
        <defs>
          <clipPath id={contentClipPathId}>
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
