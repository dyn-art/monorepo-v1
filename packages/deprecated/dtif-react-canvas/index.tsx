import { TComposition } from '@dyn/types/dtif';
import React from 'react';
import { Node } from './components';

const Canvas: React.FC<TProps> = (props) => {
  const { scene, canvasRef } = props;

  return (
    <svg
      ref={canvasRef}
      xmlns="http://www.w3.org/2000/svg"
      width={scene.width}
      height={scene.height}
      fill="none"
      viewBox={`0 0 ${scene.width} ${scene.height}`}
      style={{
        backgroundColor: 'red', // TODO: REMOVE
        WebkitPrintColorAdjust: 'exact',
      }}
      version="1.1"
    >
      <desc>{scene.name}</desc>
      <Node node={scene.root} />
    </svg>
  );
};

export default Canvas;

type TProps = {
  scene: TComposition;
  canvasRef?: React.LegacyRef<SVGSVGElement>;
};
