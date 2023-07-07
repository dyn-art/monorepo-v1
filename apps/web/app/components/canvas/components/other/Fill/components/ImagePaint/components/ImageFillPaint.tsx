import { TImagePaintFill, TNode } from '@pda/types/dtif';
import React from 'react';

const ImageFillPaint: React.FC<TProps> = (props) => {
  const { imageUrl, paint, node, index } = props;
  const imagePattern = `image_fill-pattern-${index}-${node.id}`;

  return (
    <g id={`image_fill-${index}-${node.id}`}>
      <rect
        width={node.width}
        height={node.height}
        fill={`url(#${imagePattern})`}
      />
      <defs>
        <pattern
          id={imagePattern}
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
