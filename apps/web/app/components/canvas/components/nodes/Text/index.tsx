import { getIdentifier, transformToCSS } from '@/components/canvas/utils';
import { TTextNode } from '@pda/types/dtif';
import React from 'react';
import { Fill } from '../../other';
import InnerText from './InnerText';

// https://www.mediaevent.de/tutorial/svg-text-alignment.html
const Text: React.FC<TProps> = (props) => {
  const { node, index = 0 } = props;
  const fillClipPathId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'text',
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
        type: 'text',
      })}
      style={{
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        pointerEvents: node.isLocked ? 'none' : 'auto',
        ...transformToCSS(node.relativeTransform),
      }}
    >
      <defs>
        <clipPath id={fillClipPathId}>
          <InnerText
            id={node.id}
            fillGeometry={node.fillGeometry}
            width={node.width}
            height={node.height}
            lineHeight={
              node.lineHeight.unit !== 'AUTO'
                ? `${node.lineHeight.value}${
                    node.lineHeight.unit === 'PIXELS' ? 'px' : '%'
                  }`
                : undefined
            }
            textAlignHorizontal={node.textAlignHorizontal}
            textAlignVertical={node.textAlignVertical}
            style={{
              fontFamily: node.fontName.family,
              fontSize: node.fontSize,
              textTransform: 'none',
              fontStyle: node.fontName.style,
              fontWeight: node.fontWeight,
              letterSpacing: `${
                node.letterSpacing.unit === 'PERCENT'
                  ? node.fontSize * (node.letterSpacing.value / 100)
                  : node.letterSpacing.value
              }px`,
              direction: 'ltr',
            }}
          >
            {node.characters}
          </InnerText>
        </clipPath>
      </defs>
      <Fill node={node} clipPathId={fillClipPathId} />
    </g>
  );
};

export default Text;

type TProps = {
  node: TTextNode;
  index?: number;
};
