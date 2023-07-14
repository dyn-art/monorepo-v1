import { camelToKebabCase } from '@pda/utils';
import type { CSSProperties } from 'react';
import { TD3Selection } from '../../types';

export function appendCSS<GSelection extends TD3Selection<any>>(
  selection: GSelection,
  styles: CSSProperties
): GSelection {
  for (const key in styles) {
    const content = styles[key];
    if (content != null) {
      selection.style(camelToKebabCase(key), content);
    }
  }
  return selection;
}
