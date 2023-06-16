import { TRectangleNode } from '@pda/dtif-types';
import React from 'react';
import {
  figmaBlendModeToCSS,
  figmaEffectToCSS,
  figmaTransformToCSS,
} from '../to-css';
import { getIdentifier } from '../utils';
import { renderFill } from './render-fill';

export async function renderRectangle(
  node: TRectangleNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const fill = await renderFill(node);
  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: node.width,
        height: node.height,
        borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
        opacity: node.opacity,
        overflow: 'hidden', // Fill is always clipped (clipsContent)
        ...figmaTransformToCSS(node.relativeTransform),
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
        ...style,
      }}
    >
      {fill}
    </div>
  );
}
