import { TTextNode } from '@pda/types/dtif';
import React, { SVGAttributes } from 'react';
import { useText } from './useText';

const InnerText: React.FC<TProps> = (props) => {
  const {
    children,
    textAlignHorizontal = 'LEFT',
    textAlignVertical = 'BOTTOM',
    angle = 0,
    lineHeight = '1em',
    capHeight,
    width,
    height,
    style,
  } = props;
  const { wordsByLines, style: updatedStyle } = useText({
    characters: children,
    textAlignHorizontal,
    textAlignVertical,
    angle,
    lineHeight,
    capHeight,
    width,
    height,
    style,
  });

  return (
    <>
      {wordsByLines.length > 0 ? (
        <text style={updatedStyle}>
          {wordsByLines.map((line, index) => (
            <tspan key={index} x={0} dy={index === 0 ? 0 : lineHeight}>
              {line.words.join(' ')}
            </tspan>
          ))}
        </text>
      ) : null}
    </>
  );
};

export default InnerText;

type TProps = {
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
  // Desired "line height" of the text, implemented as y offsets
  lineHeight?: SVGTSpanProps['dy'];
  // Cap height of the text
  capHeight?: SVGTSpanProps['capHeight'];
  // String (or number coercible to one) to be styled and positioned
  children: string | number;
  // Styles to be applied to the text (and used in computation of its size)
  style?: React.CSSProperties;
};

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;
