import { TImagePaintTile } from '@pda/dtif-types';

export function handleImageTileMode(imageUrl: string, fill: TImagePaintTile) {
  return {
    backgroundPosition: 'top left',
    backgroundSize: `${fill.scalingFactor * 100}%`,
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'repeat',
    transform: `rotate(${fill.rotation}deg)`,
  };
}
