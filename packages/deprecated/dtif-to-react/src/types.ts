import { TNode } from '@dyn/types/dtif';

export type TPoint = {
  x: number;
  y: number;
};

export type TInherit = {
  isLocked: TNode['isLocked'];
  isVisible: TNode['isVisible'];
};
