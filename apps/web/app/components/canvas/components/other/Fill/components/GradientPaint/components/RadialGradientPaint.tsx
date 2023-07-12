import {
  extractRadialOrDiamondGradientParams,
  getIdentifier,
  rgbToCSS,
} from '@/components/canvas/utils';
import { TNode, TRadialGradientPaintInline } from '@pda/types/dtif';
import React from 'react';

const RadialGradientPaint: React.FC<TProps> = (props) => {
  const { paint, node, index } = props;
  const gradientDefinitionId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'gradient-radial',
        isDefinition: true,
      }),
    [node.id]
  );
  const { center, radius, rotation } = React.useMemo(
    () =>
      extractRadialOrDiamondGradientParams(
        node.width,
        node.height,
        paint.transform
      ),
    [node.width, node.height, paint.transform]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'gradient-radial',
      })}
    >
      <rect
        width={node.width}
        height={node.height}
        fill={`url(#${gradientDefinitionId})`}
      />
      <defs>
        <radialGradient
          id={gradientDefinitionId}
          gradientUnits="userSpaceOnUse"
          cx={center.x}
          cy={center.y}
          r={Math.max(radius.x, radius.y)} // Ellipse radius not supported yet
          gradientTransform={`rotate(${rotation} ${center.x} ${center.y})`}
        >
          {paint.gradientStops.map((stop, i) => (
            <stop
              key={i}
              offset={stop.position !== 0 ? stop.position : undefined}
              stopColor={rgbToCSS(stop.color)}
            />
          ))}
        </radialGradient>
      </defs>
    </g>
  );
};

export default RadialGradientPaint;

type TProps = {
  node: TNode;
  index: number;
  paint: TRadialGradientPaintInline;
};
