import { TRectangleNode } from '@dyn/types/dtif';
import React from 'react';
import {
  figmaBlendModeToCSS,
  figmaEffectToCSS,
  figmaTransformToCSS,
} from '../to-css';
import { TInherit } from '../types';
import { getIdentifier } from '../utils';
import { renderFill } from './render-fill';

export async function renderRectangle(
  node: TRectangleNode,
  inherit: TInherit,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const fill = await renderFill(node);
  const isVisible = node.isVisible || inherit.isVisible;
  const isLocked = node.isLocked || inherit.isLocked;
  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        display: isVisible ? 'block' : 'none',
        width: node.width,
        height: node.height,
        borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
        opacity: node.opacity,
        overflow: 'hidden', // Fill is always clipped (clipsContent)
        pointerEvents: isLocked ? 'none' : 'auto',
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
