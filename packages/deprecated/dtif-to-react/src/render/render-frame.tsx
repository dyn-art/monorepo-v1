import { TFrameNode } from '@pda/types/dtif';
import React from 'react';
import { figmaEffectToCSS } from '../to-css';
import { figmaBlendModeToCSS } from '../to-css/figma-blend-mode-to-css';
import { figmaTransformToCSS } from '../to-css/figma-transform-to-css';
import { TInherit } from '../types';
import { getIdentifier } from '../utils';
import { renderFill } from './render-fill';
import { renderNode } from './render-node';

export async function renderFrame(
  node: TFrameNode,
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
        overflow: node.clipsContent ? 'hidden' : 'visible',
        opacity: node.opacity,
        pointerEvents: 'none',
        ...figmaTransformToCSS(node.relativeTransform),
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
        ...style,
      }}
    >
      {/* Fill */}
      {fill}
      {/* Children */}
      {await Promise.all(
        node.children.map(
          async (child) =>
            await renderNode(child, {
              isLocked,
              isVisible,
            })
        )
      )}
    </div>
  );
}
