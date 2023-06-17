import { TGroupNode } from '@pda/dtif-types';
import React from 'react';
import { figmaBlendModeToCSS, figmaEffectToCSS } from '../to-css';
import { TInherit } from '../types';
import { getIdentifier } from '../utils';
import { renderNode } from './render-node';

export async function renderGroup(
  node: TGroupNode,
  inherit: TInherit,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const isVisible = node.isVisible || inherit.isVisible;
  const isLocked = node.isLocked || inherit.isLocked;
  return (
    <div
      {...getIdentifier(node)}
      style={{
        display: isVisible ? 'block' : 'none',
        opacity: node.opacity,
        pointerEvents: isLocked ? 'none' : 'auto',
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
        ...style,
      }}
    >
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
