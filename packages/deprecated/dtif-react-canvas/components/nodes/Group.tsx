import { getIdentifier } from '@/components/canvas/utils';
import { TGroupNode } from '@dyn/types/dtif';
import React from 'react';
import Node from './Node';

const Group: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'group',
      })}
      style={{
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
      }}
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
  );
};

export default Group;

type TProps = {
  node: TGroupNode;
  index?: number;
};
