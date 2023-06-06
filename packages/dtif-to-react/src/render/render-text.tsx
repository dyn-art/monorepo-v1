import { TTextNode } from '@pda/dtif-types';
import React from 'react';
import WebFont from 'webfontloader';
import { getIdentifier } from '../helper';
import {
  figmaBlendModeToCSS,
  figmaEffectToCSS,
  figmaFillToCSS,
  figmaTransformToCSS,
} from '../to-css';

export async function renderText(
  node: TTextNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const fontFamily = node.fontName.family || 'Roboto';
  const fontWeight = node.fontWeight || 400;
  const fontSize = node.fontSize || 12;
  const letterSpacing =
    node.letterSpacing.unit === 'PERCENT'
      ? fontSize * (node.letterSpacing.value / 100)
      : node.letterSpacing.value;

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
        top: 0,
        left: 0,
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
        textAlign: node.textAlignHorizontal.toLowerCase() as any,
        justifyContent: node.textAlignVertical.toLowerCase(),
        ...figmaTransformToCSS(node),
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
        ...style,
      }}
    >
      {/* Fill */}
      {node.fills.map((fill, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            ...figmaFillToCSS(fill, node),
          }}
        >
          {node.characters}
        </div>
      ))}
    </div>
  );
}
