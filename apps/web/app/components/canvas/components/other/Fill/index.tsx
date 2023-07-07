import { TNode } from '@pda/types/dtif';
import React from 'react';
import { SolidPaint } from './components';

const Fill: React.FC<TProps> = (props) => {
  const { node, clipPathId } = props;
  if (!('fills' in node)) {
    return null;
  }
  return (
    <g
      id={`fill-${node.id}`}
      clipPath={`url(#${clipPathId})`}
      style={{
        pointerEvents: 'none',
      }}
    >
      {node.fills.map((fill, i) => {
        switch (fill.type) {
          case 'SOLID':
            return <SolidPaint node={node} index={i} paint={fill} />;
          default:
          // do nothing
        }
      })}
    </g>
  );
};

export default Fill;

type TProps = {
  node: TNode;
  clipPathId: string;
};
