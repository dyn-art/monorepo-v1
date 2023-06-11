import {
  TFrameNode,
  TGradientPaint,
  TImagePaint,
  TNode,
  TPaint,
  TRectangleNode,
  TSolidPaint,
  TTextNode,
} from '@pda/dtif-types';
import React from 'react';
import { createLinearGradient, getS3BucketURLFromHash } from '../helper';
import { figmaBlendModeToCSS } from './figma-blend-mode-to-css';
import { figmaRGBToCss } from './figma-rgb-to-css';
import { figmaTransformToCSS } from './figma-transform-to-css';

/**
 * Helper function to convert Figma fill properties to equivalent CSS properties.
 *
 * @param fills - The Figma fill properties to be translated.
 * @param node - The Figma node to which the fill is applied.
 * @param isText - A flag indicating whether the fill is applied to a text element.
 * @returns An object representing the CSS properties equivalent to the Figma fill.
 */
export function figmaFillToCSS(
  fill: TPaint,
  node: TRectangleNode | TFrameNode | TTextNode
): React.CSSProperties {
  let fillStyle: React.CSSProperties = {};

  // Handle different fill types
  switch (fill.type) {
    case 'SOLID':
      fillStyle = handleSolid(fill);
      break;
    case 'GRADIENT_LINEAR':
      console.warn(`'${fill.type}' is currently only partly supported!`);
      if (fill.exported != null) {
        fillStyle = handleExportedGradient(fill);
      } else {
        fillStyle = handleLinearGradient(fill, node);
      }
      break;
    case 'GRADIENT_RADIAL':
    case 'GRADIENT_ANGULAR':
    case 'GRADIENT_DIAMOND':
      // TODO: support later if required
      console.error(`'${fill.type}' is currently not supported!`);
      fillStyle = handleExportedGradient(fill);
      break;
    case 'IMAGE':
      fillStyle = handleImage(fill, node);
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

// Handle solid fill
function handleSolid(fill: TSolidPaint): React.CSSProperties {
  return {
    backgroundColor: figmaRGBToCss(fill.color),
  };
}

// Handle gradient fill
function handleLinearGradient(
  fill: TGradientPaint,
  node: TNode
): React.CSSProperties {
  return { background: createLinearGradient(fill, node) };
}

function handleExportedGradient(fill: TGradientPaint): React.CSSProperties {
  const imageUrl = getS3BucketURLFromHash(fill.exported?.hash || '');
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
  };
}

// Handle image fill
function handleImage(fill: TImagePaint, node: TNode): React.CSSProperties {
  const imageUrl = getS3BucketURLFromHash(fill.hash || '');

  // Apply crop transform
  // TODO: doesn't work yet
  let transform: React.CSSProperties = {};
  if (fill.transform != null) {
    transform = {
      ...figmaTransformToCSS({
        width: node.width,
        height: node.height,
        transform: fill.transform,
      }),
    };
  }

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: fill.scaleMode,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
    ...transform,
  };
}
