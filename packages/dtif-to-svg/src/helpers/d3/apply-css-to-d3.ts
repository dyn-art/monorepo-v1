import type { CSSProperties } from 'react';
import { TD3Selection } from '../../types';

export function applyCSSToD3(
  selection: TD3Selection<any>,
  styles: CSSProperties
): TD3Selection<any> {
  for (const key in styles) {
    selection.style(key, camelToKebabCase(styles[key]));
  }
  return selection;
}

function camelToKebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
