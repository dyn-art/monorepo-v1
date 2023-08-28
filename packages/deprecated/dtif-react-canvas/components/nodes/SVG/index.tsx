import { getIdentifier, transformToCSS } from '@/components/canvas/utils';
import { TSVGNode } from '@dyn/types/dtif';
import React from 'react';
import SVGInline from './SVGInline';

const SVG: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'svg',
      })}
      style={{
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
        ...transformToCSS(node.relativeTransform),
      }}
    >
      {/* TODO: Handle exported SVG */}
      {node.isExported ? null : <SVGInline node={node} />}
    </g>
  );
};

export default SVG;

type TProps = {
  node: TSVGNode;
  index?: number;
};
