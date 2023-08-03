import { TImagePaintTile } from '@pda/types/dtif';

export function handleImageTileMode(imageUrl: string, fill: TImagePaintTile) {
  return {
    backgroundPosition: 'top left',
    backgroundSize: `${fill.scalingFactor * 100}%`,
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'repeat',
    transform: `rotate(${fill.TBaseImagePaintMixin}deg)`,
  };
}
