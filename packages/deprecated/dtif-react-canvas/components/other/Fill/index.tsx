import { getIdentifier, hasFill } from '@/components/canvas/utils';
import { TNode } from '@dyn/types/dtif';
import React from 'react';
import { GradientPaint, ImagePaint, SolidPaint } from './components';

const Fill: React.FC<TProps> = (props) => {
  const { node, clipPathId } = props;
  if (!hasFill(node)) {
    return null;
  }

  return (
    <g
      id={getIdentifier({
        id: node.id,
        type: 'fill',
      })}
      clipPath={`url(#${clipPathId})`}
      style={{
        pointerEvents: 'none',
      }}
    >
      {node.fills.map((fill, i) => {
        switch (fill.type) {
          case 'SOLID':
            return (
              <SolidPaint
                key={getIdentifier({
                  id: node.id,
                  index: i,
                  type: 'paint',
                  category: 'solid',
                })}
                index={i}
                node={node}
                paint={fill}
              />
            );
          case 'IMAGE':
            return (
              <ImagePaint
                key={getIdentifier({
                  id: node.id,
                  index: i,
                  type: 'paint',
                  category: 'image',
                })}
                index={i}
                node={node}
                paint={fill}
              />
            );
          case 'GRADIENT_ANGULAR':
          case 'GRADIENT_DIAMOND':
          case 'GRADIENT_LINEAR':
          case 'GRADIENT_RADIAL':
            return (
              <GradientPaint
                key={getIdentifier({
                  id: node.id,
                  index: i,
                  type: 'paint',
                  category: 'gradient',
                })}
                index={i}
                node={node}
                paint={fill}
              />
            );
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
