import { TImagePaint, TNode } from '@pda/dtif-types';
import { getS3BucketURLFromHash } from '../../../utils';
import { handleImageCropMode } from './handle-image-crop-mode';
import { handleImageFillMode } from './handle-image-fill-mode';
import { handleImageFitMode } from './handle-image-fit-mode';
import { handleImageTileMode } from './handle-image-tile-mode';

export async function handleImageFill(
  fill: TImagePaint,
  node: TNode
): Promise<React.CSSProperties> {
  const imageUrl = getS3BucketURLFromHash(fill.hash || '');
  let fillStyle: React.CSSProperties | null = null;

  switch (fill.scaleMode) {
    case 'CROP':
      fillStyle = await handleImageCropMode(imageUrl, fill, node);
      break;
    case 'FILL':
      fillStyle = handleImageFillMode(imageUrl, fill);
      break;
    case 'FIT':
      fillStyle = handleImageFitMode(imageUrl, fill);
      break;
    case 'TILE':
      fillStyle = handleImageTileMode(imageUrl, fill);
      break;
    default:
    // do nothing
  }

  return fillStyle ?? {};
}
