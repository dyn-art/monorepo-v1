import { useText } from '@/components/canvas/hooks';
import { getIdentifier } from '@/components/canvas/utils';
import { TTextNode, TVectorPath } from '@dyn/types/dtif';
import React, { SVGAttributes } from 'react';

const InnerText: React.FC<TProps> = (props) => {
  const {
    id,
    fillGeometry,
    children,
    textAlignHorizontal = 'LEFT',
    textAlignVertical = 'BOTTOM',
    width,
    height,
    lineHeight,
    style,
  } = props;

  const text = useText({
    characters: children,
    textAlignHorizontal,
    textAlignVertical,
    width,
    height,
    lineHeight,
    textStyle: style,
  });

  if (!text.hasLoaded) {
    return (
      <>
        {(fillGeometry ?? []).map((fillGeometry, i) => {
          return (
            <path
              key={getIdentifier({
                id: id,
                index: i,
                type: 'text',
                category: 'fill-geometry',
              })}
              d={fillGeometry.data}
            />
          );
        })}
      </>
    );
  }

  return (
    <>
      {text.lines.length > 0
        ? text.lines.map((line, index) => {
            const isEmpty =
              line.words.length === 0 ||
              (line.words.length === 1 && line.words[0] === '');
            return (
              <text
                key={getIdentifier({
                  id,
                  type: 'text',
                  index,
                })}
                visibility={isEmpty ? 'hidden' : undefined}
                lengthAdjust={'spacingAndGlyphs'}
                dominantBaseline={'ideographic'}
                style={{
                  ...style,
                  transform: `translate(${
                    typeof line.x === 'string' ? line.x : `${line.x}px`
                  }, ${typeof line.y === 'string' ? line.y : `${line.y}px`})`,
                }}
              >
                {isEmpty ? '&nbsp' : line.words.join(' ')}
              </text>
            );
          })
        : null}
    </>
  );
};

export default InnerText;

type TProps = {
  id: string;
  // Width of text box
  width: number;
  // Height of text box
  height: number;
  // String (or number coercible to one) to be styled and positioned
  children: string | number;
  // Line height of the text, implemented as y offsets
  lineHeight: number;
  // Backup while font isn't loaded
  fillGeometry?: TVectorPath[];
  // Vertical text alignment
  textAlignVertical?: TTextNode['textAlignVertical'];
  // Horizontal text alignment
  textAlignHorizontal?: TTextNode['textAlignHorizontal'];
  // Styles to be applied to the text (and used in computation of its size)
  style?: React.CSSProperties;
};

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;
