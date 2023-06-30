import { TGradientPaint } from '@pda/dtif-types';
import { getS3BucketURLFromHash } from '../../utils';

export function handleExportedGradientFill(
  fill: TGradientPaint
): React.CSSProperties {
  if (!fill.isExported) return {};
  const imageUrl = getS3BucketURLFromHash(fill.hash || '');
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
  };
}
