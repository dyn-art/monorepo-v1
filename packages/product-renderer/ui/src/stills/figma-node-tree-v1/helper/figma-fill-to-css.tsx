import { extractImageCropParams } from '@figma-plugin/helpers';
import {
  TFrameNode,
  TGradientPaint,
  TImagePaint,
  TNode,
  TRectangleNode,
  TSolidPaint,
  TTextNode,
} from '@pda/shared-types';
import React from 'react';
import { createLinearGradient } from './create-linear-gradient';
import { figmaRGBToCss } from './figma-rgb-to-css';
import { getS3BucketURLFromHash } from './get-url-from-hash';

/**
 * Helper function to convert Figma fill properties to equivalent CSS properties.
 *
 * @param fills - The Figma fill properties to be translated.
 * @param node - The Figma node to which the fill is applied.
 * @param isText - A flag indicating whether the fill is applied to a text element.
 * @returns An object representing the CSS properties equivalent to the Figma fill.
 */
export function figmaFillToCSS(
  node: TRectangleNode | TFrameNode | TTextNode,
  isText = false
): React.CSSProperties {
  const { fills } = node;
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
      fillStyle = handleImage(fill, node);
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
    // ...figmaBlendModeToCSS(fill.blendMode), // Not supported as long as no support for multiple fill layers
    // opacity: fill.opacity ?? 1, // Not supported as long as no support for multiple fill layers
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

// Handle image fill
function handleImage(fill: TImagePaint, node: TNode): React.CSSProperties {
  const imageUrl = getS3BucketURLFromHash(fill.imageHash || '');

  // Apply crop transform
  let transform: string | undefined = undefined;
  if (fill.imageTransform != null) {
    const params = extractImageCropParams(
      node.width,
      node.height,
      fill.imageTransform
    );
    transform = `rotate(${params.rotation}deg) scale(${params.scale[0]}, ${params.scale[1]}) translate(${params.position[0]}px, ${params.position[1]}px)`;
    console.log('Background transform', { transform });
  }

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: fill.scaleMode,
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundSize: 'contain',
    // transform, // TODO: can't put here
  };
}
