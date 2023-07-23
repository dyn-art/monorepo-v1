import { TVector } from '@pda/types/dtif';
import React from 'react';

export function pointerEventToCompositionPoint(e: React.PointerEvent): TVector {
  // Get the bounding rectangle of target
  const rect = (e.target as any).getBoundingClientRect();

  // Calculate mouse position inside the element
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return { x, y };
}
