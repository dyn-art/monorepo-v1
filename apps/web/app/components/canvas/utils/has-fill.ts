import { TFillsMixin, TNode } from '@pda/types/dtif';

export function hasFill(node: TNode): node is TNode & TFillsMixin {
  return 'fills' in node && Array.isArray(node.fills) && node.fills.length > 0;
}
