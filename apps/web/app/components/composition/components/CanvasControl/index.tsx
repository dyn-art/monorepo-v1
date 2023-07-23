import { logger } from '@/core/logger';
import { InteractiveComposition } from '@pda/dtif-to-svg';
import React from 'react';
import { SelectionBox } from './components';

export const SceneControls: React.FC<TProps> = (props) => {
  const { composition: d3Scene } = props;
  // Calculate handleRotation here, similar to previous examples...

  // ============================================================================
  // Lifecycle
  // ============================================================================

  React.useEffect(() => {
    if (d3Scene != null) {
      d3Scene.onPointerDown((e, scene) => {
        logger.info('onPointerDown', { e, scene });
      });
      d3Scene.onPointerUp((e, scene) => {
        logger.info('onPointerUp', { e, scene });
      });
      d3Scene.onPointerMove((e, scene) => {
        logger.info('onPointerMove', { e, scene });
      });
      d3Scene.onPointerLeave((e, scene) => {
        logger.info('onPointerLeave', { e, scene });
      });
      d3Scene.onWheel((e, scene) => {
        logger.info('onWheel', { e, scene });
      });
    }
  }, [d3Scene]);

  return (
    <svg
      id={'canvas-control'}
      className="absolute w-full h-full pointer-events-none"
      overflow={'visible'}
    >
      <SelectionBox composition={d3Scene} />
    </svg>
  );
};

type TProps = {
  composition: InteractiveComposition;
};
