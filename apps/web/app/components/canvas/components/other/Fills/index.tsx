import { TNode } from '@pda/types/dtif';
import React from 'react';
import { fillToCSS } from './fill-to-css';

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
        const fillProperties = fillToCSS(fill, node);
        return (
          <rect
            id={`fill-${i}-${node.id}`}
            width={node.width}
            height={node.height}
            style={fillProperties}
          />
        );
      })}
    </g>
  );
};

export default Fills;

type TProps = {
  node: TNode;
};
