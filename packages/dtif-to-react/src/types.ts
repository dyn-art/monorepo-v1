import { TNode } from '@pda/types/dtif';

export type TPoint = {
  x: number;
  y: number;
};

export type TInherit = {
  isLocked: TNode['isLocked'];
  isVisible: TNode['isVisible'];
};
