import { TTextNode } from '@pda/dtif-types';
import React from 'react';
import WebFont from 'webfontloader';
import {
  figmaBlendModeToCSS,
  figmaEffectToCSS,
  figmaTransformToCSS,
} from '../to-css';
import { figmaTextAlignToCSS } from '../to-css/figma-text-align-to-css';
import { TInherit } from '../types';
import { getIdentifier } from '../utils';
import { renderFill } from './render-fill';

export async function renderText(
  node: TTextNode,
  inherit: TInherit,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const isVisible = node.isVisible || inherit.isVisible;
  const isLocked = node.isLocked || inherit.isLocked;
  const fontFamily = node.fontName.family || 'Roboto';
  const fontWeight = node.fontWeight || 400;
  const fontSize = node.fontSize || 12;
  const letterSpacing =
    node.letterSpacing.unit === 'PERCENT'
      ? fontSize * (node.letterSpacing.value / 100)
      : node.letterSpacing.value;
  const fill = await renderFill(
    node,
    {
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
    },
    node.characters
  );

  WebFont.load({
    google: {
      families: [`${fontFamily}:${fontWeight}`],
    },
  });

  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        display: isVisible ? 'block' : 'none',
        width: node.width,
        height: node.height,
        opacity: node.opacity,
        overflow: 'hidden', // Fill is always clipped (clipsContent)
        fontFamily: node.fontName.family,
        fontStyle: node.fontName.style,
        fontSize: node.fontSize,
        fontWeight: node.fontWeight,
        letterSpacing: `${letterSpacing}px`,
        lineHeight:
          node.lineHeight.unit === 'AUTO'
            ? 'normal'
            : `${node.lineHeight.value}${
                node.lineHeight.unit === 'PIXELS' ? 'px' : '%'
              }`,
        ...figmaTextAlignToCSS(
          node.textAlignHorizontal,
          node.textAlignVertical
        ),
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
