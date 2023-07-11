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
      {/* TODO: REMOVE LATER - Its just for reference */}
      {(node.fillGeometry ?? []).map((fillGeometry, i) => {
        return (
          <path
            key={getIdentifier({
              id: node.id,
              index: i,
              type: 'text',
              category: 'fill-geometry',
            })}
            d={fillGeometry.data}
            fill={'red'}
          />
        );
      })}

      <defs>
        <clipPath id={fillClipPathId}>
          <InnerText
            id={node.id}
            fillGeometry={node.fillGeometry}
            width={node.width}
            height={node.height}
            position={{ x: 0, y: 0 }}
            textAlignHorizontal={node.textAlignHorizontal}
            textAlignVertical={node.textAlignVertical}
            style={{
              fontFamily: node.fontName.family,
              fontSize: node.fontSize,
              textTransform: 'none',
              fontStyle: node.fontName.style,
              fontWeight: node.fontWeight,
              letterSpacing:
                node.letterSpacing.unit !== 'AUTO'
                  ? `${
                      node.letterSpacing.unit === 'PERCENT'
                        ? node.fontSize * (node.letterSpacing.value / 100)
                        : node.letterSpacing.value
                    }px`
                  : 'normal',
              direction: 'ltr',
              lineHeight:
                node.lineHeight.unit !== 'AUTO'
                  ? `${
                      node.lineHeight.unit === 'PERCENT'
                        ? node.fontSize * (node.lineHeight.value / 100)
                        : node.lineHeight.value
                    }px`
                  : 'normal',
              whiteSpace: 'nowrap',
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
