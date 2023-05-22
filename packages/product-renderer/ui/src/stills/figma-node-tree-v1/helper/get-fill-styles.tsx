import {
  TGradientPaint,
  TImagePaint,
  TNode,
  TPaint,
  TSolidPaint,
} from '@pda/shared-types';
import React, { CSSProperties } from 'react';
import { createLinearGradient } from './create-linear-gradient';
import { figmaRGBToCss } from './figma-rgb-to-css';
import { getS3BucketURLFromHash } from './get-url-from-hash';

export function getFillStyles(
  fills: ReadonlyArray<TPaint>,
  node: TNode,
  isText = false
): React.CSSProperties {
  if (fills.length === 0) {
    return {};
  }
  const fill = fills[0]; // TODO: support multiple fill layer
  let fillStyle: React.CSSProperties = {};

  // Handle different fill types
  switch (fill.type) {
    case 'SOLID':
      fillStyle = handleSolid(fill);
      break;
    case 'GRADIENT_LINEAR':
      fillStyle = handleLinearGradient(fill, node);
      break;
    case 'GRADIENT_RADIAL':
    case 'GRADIENT_ANGULAR':
    case 'GRADIENT_DIAMOND':
      // TODO: support later if required
      console.error(`'${fill.type}' is currently not supported!`);
      fillStyle = { background: 'black' };
      break;
    case 'IMAGE':
      fillStyle = handleImage(fill);
      break;
    default:
    // do nothing
  }

  return {
    ...fillStyle,
    ...(isText
      ? {
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }
      : {}),
    mixBlendMode: getBlendMode(fill.blendMode), // Set the blend mode
    opacity: fill.opacity || 1,
  };
}

// Handle solid fill type
function handleSolid(fill: TSolidPaint): React.CSSProperties {
  return {
    backgroundColor: figmaRGBToCss(fill.color),
  };
}

// Handle gradient fill types
function handleLinearGradient(
  fill: TGradientPaint,
  node: TNode
): React.CSSProperties {
  return { background: createLinearGradient(fill, node) };
}

// Handle image fill type
function handleImage(fill: TImagePaint): React.CSSProperties {
  const imageUrl = getS3BucketURLFromHash(fill.imageHash || '');
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: fill.scaleMode,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
  };
}

// Helper function to map Figma blend mode to CSS blend mode
function getBlendMode(blendMode?: string): CSSProperties['mixBlendMode'] {
  const cssBlendModes: CSSProperties['mixBlendMode'][] = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
  ];

  // Format blend mode
  const formattedBlendMode = blendMode?.toLowerCase().replace('_', '-');

  // Check whether its valid CSS blend mode
  if (
    formattedBlendMode &&
    cssBlendModes.includes(formattedBlendMode as CSSProperties['mixBlendMode'])
  ) {
    return formattedBlendMode as CSSProperties['mixBlendMode'];
  }

  return 'normal';
}
