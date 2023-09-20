import { getBucketURLFromHash } from '@/components/canvas/utils';
import { TImagePaint, TNode } from '@dyn/types/dtif';
import React from 'react';
import {
  ImageCropPaint,
  ImageFillPaint,
  ImageFitPaint,
  ImageTilePaint,
} from './components';

const ImagePaint: React.FC<TProps> = (props) => {
  const { paint, node, index } = props;
  const imageUrl = React.useMemo(
    () => getBucketURLFromHash(paint.hash),
    [paint.hash]
  );

  switch (paint.scaleMode) {
    case 'FILL':
      return (
        <ImageFillPaint
          imageUrl={imageUrl}
          paint={paint}
          node={node}
          index={index}
        />
      );
    case 'FIT':
      return (
        <ImageFitPaint
          imageUrl={imageUrl}
          paint={paint}
          node={node}
          index={index}
        />
      );
    case 'CROP':
      return (
        <ImageCropPaint
          imageUrl={imageUrl}
          paint={paint}
          node={node}
          index={index}
        />
      );
    case 'TILE':
      return (
        <ImageTilePaint
          imageUrl={imageUrl}
          paint={paint}
          node={node}
          index={index}
        />
      );
    default:
      return null;
  }
};

export default ImagePaint;

type TProps = {
  node: TNode;
  index: number;
  paint: TImagePaint;
};
