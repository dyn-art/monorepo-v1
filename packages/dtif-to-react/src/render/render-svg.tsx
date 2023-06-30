import { TSVGNode } from '@pda/dtif-types';
import React from 'react';
import { logger } from '../logger';
import { figmaTransformToCSS } from '../to-css';
import { TInherit } from '../types';
import { getIdentifier, getS3BucketURLFromHash } from '../utils';
import { convertReactCSSPropertiesToCSS } from '../utils/convert-react-css-properties-to-css';

export async function renderSVG(
  node: TSVGNode,
  inherit: TInherit,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const isVisible = node.isVisible || inherit.isVisible;
  const isLocked = node.isLocked || inherit.isLocked;
  const svgContent = await getSVGFromHash(node.isExported ? node.hash : '');
  if (svgContent == null) return <div>Failed to load SVG</div>;

  const svgStyles: React.CSSProperties = {
    position: 'absolute',
    display: isVisible ? 'block' : 'none',
    opacity: node.opacity,
    pointerEvents: isLocked ? 'none' : 'auto',
    ...figmaTransformToCSS(node.relativeTransform),
    ...style,
  };

  // Apply style to svg html tag
  const updatedSvgContent = svgContent.replace(
    '<svg',
    `<svg style="${convertReactCSSPropertiesToCSS(svgStyles)}"`
  );

  return (
    <div
      {...getIdentifier(node)}
      dangerouslySetInnerHTML={{ __html: updatedSvgContent }}
    />
  );
}

async function getSVGFromHash(hash: string): Promise<string | null> {
  const url = getS3BucketURLFromHash(hash);
  try {
    const response = await fetch(url, { method: 'GET' });
    return await response.text();
  } catch (error) {
    logger.error(`Failed to fetch SVG from ${url}!`, error);
  }
  return null;
}
