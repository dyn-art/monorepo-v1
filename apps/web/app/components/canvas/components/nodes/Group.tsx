import { TGroupNode } from '@pda/types/dtif';
import React from 'react';
import Node from './Node';

const Group: React.FC<TProps> = (props) => {
  const { node } = props;
  return (
    <g
      id={`group-${node.id}`}
      style={{
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
      }}
    >
      {node.children.map((child) => (
        <Node node={child} />
      ))}
    </g>
  );
};

export default Group;

type TProps = {
  node: TGroupNode;
};
