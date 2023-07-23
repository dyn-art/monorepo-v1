import { InteractiveComposition, Node } from '@pda/dtif-to-svg';
import React from 'react';
import { useWatcher } from '../../../../hooks';
import { EHandleSide, TXYWH } from '../../types';
import { InnerSelectionBox } from './InnerSelectionBox';

export const SelectionBox: React.FC<TProps> = React.memo((props) => {
  const { composition, onResizeHandlePointerDown } = props;
  const { selectedNode } = useWatcher(composition, ['selectedNode']);

  if (!(selectedNode instanceof Node)) {
    return null;
  }

  return (
    <InnerSelectionBox
      node={selectedNode}
      showHandles={true}
      onResizeHandlePointerDown={onResizeHandlePointerDown}
    />
  );
});

type TProps = {
  composition: InteractiveComposition;
  onResizeHandlePointerDown: (
    corner: EHandleSide,
    initialBounds: TXYWH
  ) => void;
};
