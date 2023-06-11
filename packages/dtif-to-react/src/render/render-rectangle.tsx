import { TRectangleNode } from '@pda/dtif-types';
import React from 'react';
import { getIdentifier } from '../helper';
import {
  figmaBlendModeToCSS,
  figmaEffectToCSS,
  figmaTransformToCSS,
} from '../to-css';
import { renderFill } from './render-fill';

export async function renderRectangle(
  node: TRectangleNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
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
        ...figmaTransformToCSS(node),
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
        ...style,
      }}
    >
      {renderFill(node)}
    </div>
  );
}
