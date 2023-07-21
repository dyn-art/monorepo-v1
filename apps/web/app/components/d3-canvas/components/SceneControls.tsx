import { InteractiveScene } from '@pda/dtif-to-svg';
import React from 'react';

export const SceneControls: React.FC<TProps> = (props) => {
  const { scene } = props;

  return (
    <svg
      id={'scene-controls'}
      className="absolute w-full h-full pointer-events-none"
    >
      {/* TODO */}
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{ pointerEvents: 'auto' }}
        fill="red"
      />
    </svg>
  );
};

type TProps = {
  scene: InteractiveScene;
};
