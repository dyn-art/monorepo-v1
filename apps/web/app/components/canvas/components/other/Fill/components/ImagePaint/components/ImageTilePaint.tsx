import { getIdentifier } from '@/components/canvas/utils';
import { TImagePaintTile, TNode } from '@pda/types/dtif';
import React from 'react';

const ImageTilePaint: React.FC<TProps> = (props) => {
  const { imageUrl, paint, node, index } = props;
  const imageDefinitionId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'image-tile',
        isDefinition: true,
      }),
    [node.id]
  );

  const tileWidth = React.useMemo(
    () => paint.width * paint.scalingFactor,
    [paint.width, paint.scalingFactor]
  );
  const tileHeight = React.useMemo(
    () => paint.height * paint.scalingFactor,
    [paint.height, paint.scalingFactor]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'image-tile',
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
          width={tileWidth}
          height={tileHeight}
          style={{
            transformOrigin: 'center center',
            transform: `rotate(${paint.rotation}deg)`,
          }}
        >
          <image
            href={imageUrl}
            x="0"
            y="0"
            width={tileWidth}
            height={tileHeight}
          />
        </pattern>
      </defs>
    </g>
  );
};

export default ImageTilePaint;

type TProps = {
  node: TNode;
  index: number;
  imageUrl: string;
  paint: TImagePaintTile;
};
