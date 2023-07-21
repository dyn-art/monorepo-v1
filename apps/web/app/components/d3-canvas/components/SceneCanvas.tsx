import React from 'react';

export const SceneCanvas: React.FC<TProps> = (props) => {
  const { d3SceneRef } = props;

  return (
    <div
      id={'scene-canvas'}
      ref={d3SceneRef as any}
      className="absolute h-full w-full pointer-events-auto"
    />
  );
};

type TProps = {
  d3SceneRef: React.LegacyRef<HTMLDivElement>;
};
