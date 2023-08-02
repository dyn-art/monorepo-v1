import { TImagePaintFit } from '@pda/types/dtif';

export function handleImageFitMode(imageUrl: string, fill: TImagePaintFit) {
  return {
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    transform: `rotate(${fill.rotation}deg)`,
  };
}
