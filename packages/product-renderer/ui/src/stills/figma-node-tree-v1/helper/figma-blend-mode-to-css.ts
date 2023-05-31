import { TBlendMode } from '@pda/dtif-types';

const cssBlendModes: React.CSSProperties['mixBlendMode'][] = [
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

/**
 * Helper function to map Figma blend mode to equivalent CSS string.
 *
 * @param value - The blend mode value from Figma.
 * @returns An object representing the CSS properties equivalent to the Figma blend mode.
 */
export function figmaBlendModeToCSS(value?: TBlendMode): React.CSSProperties {
  let blendMode: React.CSSProperties['mixBlendMode'] = 'normal';

  // Format blend mode
  const formattedBlendMode = value?.toLowerCase().replace('_', '-');

  // Check whether its valid CSS blend mode
  if (
    formattedBlendMode &&
    cssBlendModes.includes(
      formattedBlendMode as React.CSSProperties['mixBlendMode']
    )
  ) {
    blendMode = formattedBlendMode as React.CSSProperties['mixBlendMode'];
  }

  return { mixBlendMode: blendMode };
}
