import { TFillMixin } from '@dyn/types/dtif';

export function hasFillFigma(obj: any): obj is MinimalFillsMixin {
  return obj != null && typeof obj === 'object' && 'fills' in obj;
}

export function hasFillDTIF(obj: any): obj is TFillMixin {
  return obj != null && typeof obj === 'object' && 'fill' in obj;
}
