import { textAlignmentToCSS, transformToCSS } from '@/components/canvas/utils';
import { TTextNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../other';

// https://www.mediaevent.de/tutorial/svg-text-alignment.html
const Text: React.FC<TProps> = (props) => {
  const { node } = props;
  const fillClipPathId = `text_fill-clip-${node.id}`;

  return (
    <g
      id={`text-${node.id}`}
      style={{
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
        ...transformToCSS(node.relativeTransform),
      }}
    >
      <defs>
        <clipPath id={fillClipPathId}>
          <text
            style={{
              textTransform: 'none',
              fontFamily: node.fontName.family,
              fontStyle: node.fontName.style,
              fontSize: node.fontSize,
              fontWeight: node.fontWeight,
              letterSpacing: `${
                node.letterSpacing.unit === 'PERCENT'
                  ? node.fontSize * (node.letterSpacing.value / 100)
                  : node.letterSpacing.value
              }px`,
              lineHeight:
                node.lineHeight.unit === 'AUTO'
                  ? 'normal'
                  : `${node.lineHeight.value}${
                      node.lineHeight.unit === 'PIXELS' ? 'px' : '%'
                    }`,
              direction: 'ltr',
              ...textAlignmentToCSS(node),
            }}
          >
            {node.characters}
          </text>
        </clipPath>
      </defs>
      <Fill node={node} clipPathId={fillClipPathId} />
    </g>
  );
};

export default Text;

type TProps = {
  node: TTextNode;
};
