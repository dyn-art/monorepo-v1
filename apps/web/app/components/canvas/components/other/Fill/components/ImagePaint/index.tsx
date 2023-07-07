import { getS3BucketURLFromHash } from '@pda/dtif-to-react';
import { TImagePaint, TNode } from '@pda/types/dtif';
import React from 'react';
import { ImageFillPaint, ImageFitPaint } from './components';

const ImagePaint: React.FC<TProps> = (props) => {
  const { paint, node, index } = props;
  const imageUrl = React.useMemo(
    () => getS3BucketURLFromHash(paint.hash),
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
