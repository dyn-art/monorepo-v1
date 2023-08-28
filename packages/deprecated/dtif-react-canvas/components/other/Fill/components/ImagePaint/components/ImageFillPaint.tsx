import { getIdentifier } from '@/components/canvas/utils';
import { TImagePaintFill, TNode } from '@dyn/types/dtif';
import React from 'react';

const ImageFillPaint: React.FC<TProps> = (props) => {
  const { imageUrl, paint, node, index } = props;
  const imageDefinitionId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'image-fill',
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
        category: 'image-fill',
      })}
    >
      <rect
        width={node.width}
        height={node.height}
        fill={`url(#${imageDefinitionId})`}
      />
      <defs>
        <pattern
          id={imageDefinitionId}
          patternUnits="userSpaceOnUse"
          width={node.width}
          height={node.height}
          style={{
            transformOrigin: 'center center',
            transform: `rotate(${paint.rotation}deg)`,
          }}
        >
          <image
            href={imageUrl}
            x="0"
            y="0"
            width={node.width}
            height={node.height}
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      </defs>
    </g>
  );
};

export default ImageFillPaint;

type TProps = {
  node: TNode;
  index: number;
  imageUrl: string;
  paint: TImagePaintFill;
};
