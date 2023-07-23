import { extractTransformMatrixData } from '@pda/dtif-to-svg';
import { TTransform } from '@pda/types/dtif';
import React from 'react';

export function useMatrixTransform(transform: TTransform) {
  return React.useMemo(
    () => extractTransformMatrixData(transform),
    [transform]
  );
}
