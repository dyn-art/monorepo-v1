import { TScene } from '@pda/types/dtif';
import React from 'react';
import { logger } from '../../core/logger';
import { SceneCanvas, SceneControls } from './components';
import { useD3Scene } from './hooks';
import styles from './styles.css';

// https://remix.run/docs/en/main/guides/styling#shared-stylesheet
export const links = () => [{ rel: 'stylesheet', href: styles }];

const D3Canvas: React.FC<TProps> = (props) => {
  const { scene } = props;
  const {
    d3Scene,
    isLoading: isD3SceneLoading,
    canvasRef: d3SceneRef,
  } = useD3Scene(scene);

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
    <div className="flex items-center justify-center">
      <div
        id={'scene'}
        className="scene-container"
        style={{ width: scene.width, height: scene.height }}
      >
        <SceneCanvas
          d3SceneRef={d3SceneRef as unknown as React.LegacyRef<HTMLDivElement>}
        />
        {d3Scene != null ? <SceneControls scene={d3Scene} /> : null}
      </div>
    </div>
  );
};

export default D3Canvas;

type TProps = {
  scene: TScene;
};
