import { TComposition } from '@dyn/types/dtif';
import React from 'react';
import { Canvas, CanvasControl } from './components';
import { useComposition } from './hooks';
import styles from './styles.css';

// https://remix.run/docs/en/main/guides/styling#shared-stylesheet
export const links = () => [{ rel: 'stylesheet', href: styles }];

export const Composition: React.FC<TProps> = (props) => {
  const { composition } = props;
  const {
    d3Scene,
    isLoading,
    canvasRef: compositionCanvasRef,
  } = useComposition(composition);

  return (
    <div className="flex items-center justify-center">
      <div
        id={'scene'}
        className={'overflow-visible relative cursor-auto'}
        style={{
          width: composition.width,
          height: composition.height,
        }}
      >
        <Canvas canvasRef={compositionCanvasRef} />
        {d3Scene != null ? <CanvasControl composition={d3Scene} /> : null}
      </div>
    </div>
  );
};

type TProps = {
  composition: TComposition;
};
