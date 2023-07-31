export function hasFill(obj: any): obj is MinimalFillsMixin {
  return obj != null && typeof obj === 'object' && 'fills' in obj;
}
