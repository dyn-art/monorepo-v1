import { TNode } from '@pda/shared-types';

export function getIdentifier(node: TNode) {
  return {
    key: `${node.id}`,
    id: `${node.id}_${node.name.toLowerCase().replace(' ', '-')}`,
  };
}
