import { getIdentifier, transformToCSS } from '@/components/canvas/utils';
import { TFrameNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';
import Node from './Node';

const Frame: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;
  const contentClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'frame',
        category: 'content-clip',
        isDefinition: true,
      }),
    [node.id]
  );
  const fillClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'frame',
        category: 'fill-clip',
        isDefinition: true,
      }),
    [node.id]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'frame',
      })}
      style={{ ...transformToCSS(node.relativeTransform) }}
    >
      {/* Frame Content */}
      <g
        id={getIdentifier({
          id: node.id,
          index,
          type: 'frame',
          category: 'content',
        })}
        clipPath={node.clipsContent ? `url(#${contentClipPathId})` : undefined}
      >
        <defs>
          <clipPath id={fillClipPathId}>
            <rect width={node.width} height={node.height} />
          </clipPath>
        </defs>
        <Fill node={node} clipPathId={fillClipPathId} />
        <g
          id={getIdentifier({
            id: node.id,
            index,
            type: 'frame',
            category: 'children',
          })}
        >
          {node.children.map((child, i) => (
            <Node
              key={getIdentifier({
                id: node.id,
                index: i,
                type: 'child',
              })}
              index={i}
              node={child}
            />
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
  index?: number;
};
