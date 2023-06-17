import { TGradientPaint } from '@pda/dtif-types';
import { getS3BucketURLFromHash } from '../../utils';

export function handleExportedGradientFill(
  fill: TGradientPaint
): React.CSSProperties {
  const imageUrl = getS3BucketURLFromHash(fill.exported?.hash || '');
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
  };
}
