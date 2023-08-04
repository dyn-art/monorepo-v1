import { getIdentifier } from '@/components/canvas/utils';
import { TImagePaintFit, TNode } from '@pda/types/dtif';
import React from 'react';

const ImageFitPaint: React.FC<TProps> = (props) => {
  const { imageUrl, paint, node, index } = props;
  const imageDefinitionId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'image-fit',
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
        category: 'image-fit',
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
          />
        </pattern>
      </defs>
    </g>
  );
};

export default ImageFitPaint;

type TProps = {
  node: TNode;
  index: number;
  imageUrl: string;
  paint: TImagePaintFit;
};
