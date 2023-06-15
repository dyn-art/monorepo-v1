import { TFrameNode } from '@pda/dtif-types';
import React from 'react';
import { applyScaleToMatrix } from '../utils';
import { renderFrame } from './render-frame';

export async function renderRelativeParent(
  node: TFrameNode,
  scale = 1
): Promise<React.ReactNode> {
  const renderedFrame = await renderFrame(
    {
      ...node,
      transform: applyScaleToMatrix(node.transform, scale),
    },
    { transformOrigin: 'top left' }
  );
  return (
    <div
      style={{
        position: 'relative',
        width: node.width * scale,
        height: node.height * scale,
      }}
    >
      {renderedFrame}
    </div>
  );
}
