import { TFrameNode, TPaint, TRectangleNode, TTextNode } from '@pda/types/dtif';
import React from 'react';
import { figmaBlendModeToCSS } from '../figma-blend-mode-to-css';
import { handleExportedGradientFill } from './handle-exported-gradient-fill';
import { handleImageFill } from './handle-image-fill';
import { handleSolidFill } from './handle-solid-fill';

/**
 * Helper function to convert Figma fill properties to equivalent CSS properties.
 *
 * @param fills - The Figma fill properties to be translated.
 * @param node - The Figma node to which the fill is applied.
 * @returns An object representing the CSS properties equivalent to the Figma fill.
 */
export async function figmaFillToCSS(
  fill: TPaint,
  node: TRectangleNode | TFrameNode | TTextNode
): Promise<React.CSSProperties> {
  let fillStyle: React.CSSProperties = {};

  // Handle different fill types
  switch (fill.type) {
    case 'SOLID':
      fillStyle = handleSolidFill(fill);
      break;
    case 'GRADIENT_LINEAR':
      console.warn(`'${fill.type}' is currently only partly as SVG supported!`);
      fillStyle = handleExportedGradientFill(fill);
      break;
    case 'GRADIENT_RADIAL':
    case 'GRADIENT_ANGULAR':
    case 'GRADIENT_DIAMOND':
      console.warn(`'${fill.type}' is currently only partly as JPG supported!`);
      fillStyle = handleExportedGradientFill(fill);
      break;
    case 'IMAGE':
      fillStyle = await handleImageFill(fill, node);
      break;
    default:
    // do nothing
  }

  return {
    ...fillStyle,
    ...figmaBlendModeToCSS(fill.blendMode),
    opacity: fill.opacity ?? 1,
  };
}
