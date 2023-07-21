import { InteractiveScene } from '@pda/dtif-to-svg';
import React from 'react';
import { useWatcher } from '../hooks';

const SelectedNodeDisplay: React.FC<TProps> = (props) => {
  const { scene } = props;
  const { selectedNode } = useWatcher(scene, ['selectedNode']);

  return (
    <div>
      <p>{selectedNode != null ? selectedNode.name : 'none'}</p>
    </div>
  );
};

export default SelectedNodeDisplay;

type TProps = {
  scene: InteractiveScene;
};
