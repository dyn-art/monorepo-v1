import { TFrameNode } from '@dyn/types/dtif';
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
      relativeTransform: applyScaleToMatrix(node.relativeTransform, scale),
    },
    { isLocked: false, isVisible: true }
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
