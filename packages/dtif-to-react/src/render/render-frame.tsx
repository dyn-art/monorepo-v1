import { TFrameNode } from '@pda/dtif-types';
import React from 'react';
import { figmaEffectToCSS } from '../to-css';
import { figmaBlendModeToCSS } from '../to-css/figma-blend-mode-to-css';
import { figmaTransformToCSS } from '../to-css/figma-transform-to-css';
import { getIdentifier } from '../utils';
import { renderFill } from './render-fill';
import { renderNode } from './render-node';

export async function renderFrame(
  node: TFrameNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const fill = await renderFill(node);
  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        width: node.width,
        height: node.height,
        overflow: node.clipsContent ? 'hidden' : 'visible',
        opacity: node.opacity,
        ...figmaTransformToCSS(node),
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
        ...style,
      }}
    >
      {/* Fill */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden', // Fill is always clipped (clipsContent)
        }}
      >
        {fill}
      </div>
      {/* Children */}
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
