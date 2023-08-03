import { TFillsMixin } from '@pda/types/dtif';

export function hasFillsFigma(obj: any): obj is MinimalFillsMixin {
  return obj != null && typeof obj === 'object' && 'fills' in obj;
}

export function hasFillsDTIF(obj: any): obj is TFillsMixin {
  return obj != null && typeof obj === 'object' && 'fills' in obj;
}
