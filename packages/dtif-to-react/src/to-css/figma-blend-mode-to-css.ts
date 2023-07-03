import { TBlendMode } from '@pda/types/dtif';

export const figmaBlendModeToCSSMap: Record<
  TBlendMode,
  React.CSSProperties['mixBlendMode']
> = {
  PASS_THROUGH: 'normal',
  NORMAL: 'normal',
  DARKEN: 'darken',
  MULTIPLY: 'multiply',
  LINEAR_BURN: 'color-burn',
  COLOR_BURN: 'color-burn',
  LIGHTEN: 'lighten',
  SCREEN: 'screen',
  LINEAR_DODGE: 'color-dodge',
  COLOR_DODGE: 'color-dodge',
  OVERLAY: 'overlay',
  SOFT_LIGHT: 'soft-light',
  HARD_LIGHT: 'hard-light',
  DIFFERENCE: 'difference',
  EXCLUSION: 'exclusion',
  HUE: 'hue',
  SATURATION: 'saturation',
  COLOR: 'color',
  LUMINOSITY: 'luminosity',
};

/**
 * Helper function to map Figma blend mode to equivalent CSS string.
 *
 * @param value - The blend mode value from Figma.
 * @returns An object representing the CSS properties equivalent to the Figma blend mode.
 */
export function figmaBlendModeToCSS(
  blendMode: TBlendMode = 'PASS_THROUGH'
): React.CSSProperties {
  return { mixBlendMode: figmaBlendModeToCSSMap[blendMode] ?? 'normal' };
}
