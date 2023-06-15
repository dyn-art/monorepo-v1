import { TGroupNode } from '@pda/dtif-types';
import React from 'react';
import { figmaBlendModeToCSS, figmaEffectToCSS } from '../to-css';
import { getIdentifier } from '../utils';
import { renderNode } from './render-node';

export async function renderGroup(
  node: TGroupNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  return (
    <div
      {...getIdentifier(node)}
      style={{
        opacity: node.opacity,
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
        ...style,
      }}
    >
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
