import { extractTransformMatrixData } from '@pda/dtom';
import { TTransform } from '@pda/types/dtif';
import React from 'react';

export function useMatrixTransform(transform: TTransform) {
  return React.useMemo(
    () => extractTransformMatrixData(transform),
    [transform]
  );
}
