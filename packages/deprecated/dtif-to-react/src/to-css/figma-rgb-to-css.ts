/**
 * Helper function to convert a RGB color object from 0 to 1 scale to 0 to 255 scale
 * and return it as CSS string.
 */
export function figmaRGBToCss(color: {
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
