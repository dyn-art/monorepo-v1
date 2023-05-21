import { extractLinearGradientParamsFromTransform } from '@figma-plugin/helpers';
import {
  TGradientPaint,
  TImagePaint,
  TPaint,
  TSolidPaint,
} from '@pda/shared-types';
import React, { CSSProperties } from 'react';
import { getS3BucketURLFromHash } from './get-url-from-hash';

export function getFillStyles(
  fills: ReadonlyArray<TPaint>,
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
    case 'GRADIENT_RADIAL':
    case 'GRADIENT_ANGULAR':
    case 'GRADIENT_DIAMOND':
      fillStyle = handleGradient(fill);
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
    backgroundColor: convertRGB(fill.color),
  };
}

// Handle gradient fill types
// TODO: https://forum.figma.com/t/how-to-convert-figma-gradient-to-css-gradient/20814
function handleGradient(fill: TGradientPaint): React.CSSProperties {
  // Retrieve gradient start and end from gradient transformation
  const params = extractLinearGradientParamsFromTransform(
    100,
    100,
    fill.gradientTransform
  );

  // Calculate the angle of the gradient
  let angle =
    Math.atan2(
      params.end[1] - params.start[1],
      params.end[0] - params.start[0]
    ) *
    (180 / Math.PI);

  // Adjust the angle range from [-180, 180] to [0, 360]
  if (angle < 0) angle += 360;

  // Calculate the length of the gradient line
  const length = Math.sqrt(
    Math.pow(params.end[0] - params.start[0], 2) +
      Math.pow(params.end[1] - params.start[1], 2)
  );

  // Create gradient stops in CSS format
  const stops = fill.gradientStops.map((stop) => {
    // Calculate the position of the stop along the gradient line
    const position = ((stop.position * length) / Math.max(100, 100)) * 100;

    return `${convertRGB(stop.color)} ${position.toFixed(2)}%`;
  });

  // Create CSS gradient
  return {
    background: `linear-gradient(${angle.toFixed(2)}deg, ${stops.join(', ')})`,
  };
}

// Handle image fill type
function handleImage(fill: TImagePaint): React.CSSProperties {
  const imageUrl = getS3BucketURLFromHash(fill.imageHash || '');
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: fill.scaleMode,
    backgroundRepeat: 'no-repeat',
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

// Helper function to convert a RGB color object from 0 to 1 scale to 0 to 255 scale
function convertRGB(color: {
  r: number;
  g: number;
  b: number;
  a?: number;
}): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgba(${r}, ${g}, ${b}, ${color.a ?? 1})`;
}
