import { TFrameNode } from '@pda/dtif-types';
import React from 'react';
import { getIdentifier } from '../helper';
import { figmaEffectToCSS, figmaFillToCSS } from '../to-css';
import { figmaBlendModeToCSS } from '../to-css/figma-blend-mode-to-css';
import { figmaTransformToCSS } from '../to-css/figma-transform-to-css';
import { renderNode } from './render-node';

export async function renderFrame(
  node: TFrameNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
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
        {node.fills.map((fill, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              ...figmaFillToCSS(fill, node),
            }}
          />
        ))}
      </div>
      {/* Children */}
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
