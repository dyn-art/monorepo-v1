import { TNode } from '@dyn/types/dtif';

/**
 * Helper function to get a unique React component id and key based on a node.
 */
export function getIdentifier(node: TNode) {
  return {
    key: `${node.id}`,
    id: `${node.id}_${node.name.toLowerCase().replace(' ', '-')}`,
  };
}
