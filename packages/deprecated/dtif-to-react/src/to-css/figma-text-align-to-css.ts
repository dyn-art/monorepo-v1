import { TTextNode } from '@dyn/types/dtif';

export const figmaVerticalTextAlignToCSSMap: Record<
  TTextNode['textAlignVertical'],
  React.CSSProperties['justifyContent']
> = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom',
};

export const figmaHorizontalTextAlignToCSSMap: Record<
  TTextNode['textAlignHorizontal'],
  React.CSSProperties['textAlign']
> = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFIED: 'justify',
};

/**
 * Helper function to map Figma text align to equivalent CSS string.
 *
 * @param value - The text align value from Figma.
 * @returns An object representing the CSS properties equivalent to the Figma text align.
 */
export function figmaTextAlignToCSS(
  horizontal: TTextNode['textAlignHorizontal'] = 'CENTER',
  vertical: TTextNode['textAlignVertical'] = 'CENTER'
): React.CSSProperties {
  return {
    textAlign: figmaHorizontalTextAlignToCSSMap[horizontal],
    justifyContent: figmaVerticalTextAlignToCSSMap[vertical],
  };
}
