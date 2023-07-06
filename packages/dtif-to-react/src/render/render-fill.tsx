import { TFrameNode, TRectangleNode, TTextNode } from '@pda/types/dtif';
import React from 'react';
import { figmaFillToCSS } from '../to-css';

export async function renderFill(
  node: TFrameNode | TRectangleNode | TTextNode,
  additionalProperties: React.CSSProperties = {},
  children: React.ReactNode = null
): Promise<React.ReactNode> {
  return Promise.all(
    node.fills.map(async (fill, i) => {
      const fillProperties = await figmaFillToCSS(fill, node);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden', // Fill is always clipped (clipsContent)
            pointerEvents: 'none',
            ...additionalProperties,
            ...fillProperties,
          }}
        >
          {children}
        </div>
      );
    })
  );
}
