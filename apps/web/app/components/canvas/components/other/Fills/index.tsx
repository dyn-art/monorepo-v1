import { TNode } from '@pda/types/dtif';
import React from 'react';
import { SolidFill } from './components';

const Fills: React.FC<TProps> = (props) => {
  const { node } = props;
  if (!('fills' in node)) {
    return null;
  }
  return (
    <g
      id={`fills-${node.id}`}
      style={{
        pointerEvents: 'none',
      }}
    >
      {node.fills.map((fill, i) => {
        switch (fill.type) {
          case 'SOLID':
            return <SolidFill node={node} index={i} paint={fill} />;
          default:
          // do nothing
        }
      })}
    </g>
  );
};

export default Fills;

type TProps = {
  node: TNode;
};
