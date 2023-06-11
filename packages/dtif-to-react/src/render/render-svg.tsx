import { TSVGNode } from '@pda/dtif-types';
import React from 'react';
import { getIdentifier, getS3BucketURLFromHash } from '../helper';
import { logger } from '../logger';
import { figmaTransformToCSS } from '../to-css';

export async function renderSVG(
  node: TSVGNode,
  style: React.CSSProperties = {}
): Promise<React.ReactNode> {
  const svgContent = await getSVGFromHash(node?.hash || '');
  if (svgContent == null) return <div>Failed to load SVG</div>;

  const svgStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: node.opacity,
    ...figmaTransformToCSS(node, false),
    ...style,
  };

  // Apply style to svg html tag
  const styleString = Object.entries(svgStyles)
    .map(([key, value]) => `${key}:${value}`)
    .join('; ');
  const updatedSvgContent = svgContent.replace(
    '<svg',
    `<svg style="${styleString}"`
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
