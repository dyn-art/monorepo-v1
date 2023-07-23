import { InteractiveComposition, Node } from '@pda/dtif-to-svg';
import React from 'react';
import { useWatcher } from '../../../../hooks';
import { InnerSelectionBox } from './InnerSelectionBox';

export const SelectionBox: React.FC<TProps> = (props) => {
  const { composition } = props;
  const { selectedNode } = useWatcher(composition, ['selectedNode']);

  if (!(selectedNode instanceof Node)) {
    return null;
  }

  return <InnerSelectionBox node={selectedNode} showHandles={true} />;
};

type TProps = {
  composition: InteractiveComposition;
};
