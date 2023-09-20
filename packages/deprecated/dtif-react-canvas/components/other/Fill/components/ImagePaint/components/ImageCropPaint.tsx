import {
  applyDimensionsToImageTransformData,
  calculateCropImageSize,
  extractMatrixData,
  getIdentifier,
  transformToCSS,
} from '@/components/canvas/utils';
import { TImagePaintCrop, TNode } from '@dyn/types/dtif';
import React from 'react';

const ImageCropPaint: React.FC<TProps> = (props) => {
  const { imageUrl, paint, node, index } = props;
  const imageDefinitionId = React.useMemo(
    () =>
      getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'image-crop',
        isDefinition: true,
      }),
    [node.id]
  );

  // Calculate crop image size
  // -> the image size so that it fits into the crop container
  const { width: cropImageWidth, height: cropImageHeight } = React.useMemo(
    () =>
      calculateCropImageSize(
        { width: node.width, height: node.height },
        {
          width: paint.width,
          height: paint.height,
        }
      ),
    [node.width, node.height, paint.width, paint.height]
  );

  // Extract transform data from transform matrix and apply image dimensions
  // as the transform matrix is based on percentage
  const transformDataWithDimensions = React.useMemo(
    () =>
      applyDimensionsToImageTransformData(
        extractMatrixData(paint.transform),
        { width: cropImageWidth, height: cropImageHeight },
        { width: node.width, height: node.height }
      ),
    [cropImageWidth, cropImageHeight, node.width, node.height]
  );

  return (
    <g
      id={getIdentifier({
        id: node.id,
        index,
        type: 'paint',
        category: 'image-crop',
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
          width={cropImageWidth}
          height={cropImageHeight}
        >
          <image
            href={imageUrl}
            x="0"
            y="0"
            width={cropImageWidth}
            height={cropImageHeight}
            style={transformToCSS(transformDataWithDimensions)}
          />
        </pattern>
      </defs>
    </g>
  );
};

export default ImageCropPaint;

type TProps = {
  node: TNode;
  index: number;
  imageUrl: string;
  paint: TImagePaintCrop;
};
