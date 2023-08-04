import { InteractiveComposition } from '@pda/dtom';
import { TVector } from '@pda/types/dtif';
import React from 'react';

export function pointerEventToCompositionPoint(
  e: React.PointerEvent,
  composition: InteractiveComposition
): TVector {
  // Get the bounding rectangle of target
  const rect = composition.getD3Node()?.element.node().getBoundingClientRect();

  // Calculate mouse position inside the element
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return { x, y };
}
