import { TImagePaintFit } from '@pda/dtif-types';

export function handleImageFitMode(imageUrl: string, fill: TImagePaintFit) {
  return {
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    transform: `rotate(${fill.rotation}deg)`,
  };
}
