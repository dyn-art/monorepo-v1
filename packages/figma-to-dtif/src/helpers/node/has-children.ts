import { TChildrenMixin } from '@pda/types/dtif';

export function hasChildrenFigma(obj: any): obj is ChildrenMixin {
  return obj != null && typeof obj === 'object' && 'children' in obj;
}

export function hasChildrenDTIF(obj: any): obj is TChildrenMixin {
  return obj != null && typeof obj === 'object' && 'childIds' in obj;
}
