import { TImagePaintFill } from '@dyn/types/dtif';

export function handleImageFillMode(
  imageUrl: string,
  fill: TImagePaintFill
): React.CSSProperties {
  return {
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    transform: `rotate(${fill.rotation}deg)`,
  };
}
