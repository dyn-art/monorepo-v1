import { getIdentifier, rgbToCSS } from '@/components/canvas/utils';
import { TLinearGradientPaintInline, TNode } from '@pda/types/dtif';
import React from 'react';

const LinearGradientPaint: React.FC<TProps> = (props) => {
  const { paint, node, index } = props;
  const gradientDefinitionId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'gradient-linear',
        isDefinition: true,
      }),
    [node.id]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'gradient-linear',
      })}
    >
      <rect
        width={node.width}
        height={node.height}
        fill={`url(#${gradientDefinitionId})`}
      />
      <defs>
        <linearGradient
          id={gradientDefinitionId}
          x1={paint.start.x}
          y1={paint.start.y}
          x2={paint.end.x}
          y2={paint.end.y}
        >
          {paint.gradientStops.map((stop) => (
            <stop offset={stop.position} stopColor={rgbToCSS(stop.color)} />
          ))}
        </linearGradient>
      </defs>
    </g>
  );
};

export default LinearGradientPaint;

type TProps = {
  node: TNode;
  index: number;
  paint: TLinearGradientPaintInline;
};
