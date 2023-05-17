import {
  TGradientPaint,
  TImagePaint,
  TPaint,
  TSolidPaint,
} from '@pda/shared-types';
import { CSSProperties } from 'react';
import { getS3BucketURLFromHash } from './get-url-from-hash';

export function getFillStyles(
  fills: ReadonlyArray<TPaint>
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
    mixBlendMode: getBlendMode(fill.blendMode), // Set the blend mode
    opacity: fill.opacity || 1,
  };
}

// Handle solid fill type
function handleSolid(fill: TSolidPaint): React.CSSProperties {
  const { r, g, b } = fill.color;
  return {
    backgroundColor: `rgb(${r * 255}, ${g * 255}, ${b * 255})`,
  };
}

// Handle gradient fill types
function handleGradient(fill: TGradientPaint): React.CSSProperties {
  const stops = fill.gradientStops
    .map(
      (stop) =>
        `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${
          stop.color.a || 1
        }) ${stop.position * 100}%`
    )
    .join(', ');
  const gradientType = fill.type.replace('GRADIENT_', '').toLowerCase();
  return {
    background: `${gradientType}-gradient(${stops})`,
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
