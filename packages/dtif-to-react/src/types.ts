import { TNode } from '@pda/dtif-types';

export type TPoint = {
  x: number;
  y: number;
};

export type TInherit = {
  isLocked: TNode['isLocked'];
  isVisible: TNode['isVisible'];
};
