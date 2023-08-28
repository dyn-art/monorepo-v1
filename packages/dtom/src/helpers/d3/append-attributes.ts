import { TD3Selection } from '@/types';

export function appendAttributes<GSelection extends TD3Selection<any>>(
  selection: GSelection,
  attributes: Record<string, any>
): GSelection {
  for (const key in attributes) {
    const content = attributes[key];
    if (content != null) {
      selection.attr(key, content);
    }
  }
  return selection;
}
