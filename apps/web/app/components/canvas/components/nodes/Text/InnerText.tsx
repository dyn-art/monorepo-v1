import { useText } from '@/components/canvas/hooks';
import { getIdentifier } from '@/components/canvas/utils';
import { TTextNode, TVectorPath } from '@pda/types/dtif';
import React, { SVGAttributes } from 'react';

const InnerText: React.FC<TProps> = (props) => {
  const {
    id,
    fillGeometry,
    children,
    textAlignHorizontal = 'LEFT',
    textAlignVertical = 'BOTTOM',
    angle = 0,
    capHeight,
    width,
    height,
    style,
  } = props;

  const text = useText({
    characters: children,
    textAlignHorizontal,
    textAlignVertical,
    angle,
    capHeight,
    width,
    height,
    style,
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
      {text.wordsByLines.length > 0 ? (
        <text style={text.style}>
          {text.wordsByLines.map((line, index) => {
            const isEnter =
              line.words.length === 0 ||
              (line.words.length === 1 && line.words[0] === '');
            return (
              <tspan
                key={index}
                x={0}
                dy={style?.lineHeight}
                visibility={isEnter ? 'hidden' : undefined}
              >
                {isEnter ? '&nbsp' : line.words.join(' ')}
              </tspan>
            );
          })}
        </text>
      ) : null}
    </>
  );
};

export default InnerText;

type TProps = {
  id: string;
  // Backup while font isn't loaded
  fillGeometry?: TVectorPath[];
  // Vertical text alignment
  textAlignVertical?: TTextNode['textAlignVertical'];
  // Horizontal text alignment
  textAlignHorizontal?: TTextNode['textAlignHorizontal'];
  // Rotation angle of the text
  angle?: number;
  // Width of text box
  width: number;
  // Height of text box
  height: number;
  // Cap height of the text
  capHeight?: SVGTSpanProps['capHeight'];
  // String (or number coercible to one) to be styled and positioned
  children: string | number;
  // Styles to be applied to the text (and used in computation of its size)
  style?: React.CSSProperties;
};

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;
