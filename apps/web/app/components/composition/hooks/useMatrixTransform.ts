import { extractTransformMatrixData } from '@dyn/dtom';
import { TTransform } from '@dyn/types/dtif';
import React from 'react';

export function useMatrixTransform(transform: TTransform) {
  return React.useMemo(
    () => extractTransformMatrixData(transform),
    [transform]
  );
}
