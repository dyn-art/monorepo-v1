import { notEmpty } from '@dyn/utils';

/**
 * Constructs a rectangle SVG path string based on the given border radian
 * and width & height of the rectangle.
 *
 * @param {Object} props - An object contains the parameters needed.
 * @returns {string} SVG path string.
 */
export function createRectanglePath(props: {
  width: number;
  height: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomRightRadius: number;
  bottomLeftRadius: number;
}): string {
  const {
    width,
    height,
    topLeftRadius,
    topRightRadius,
    bottomRightRadius,
    bottomLeftRadius,
  } = props;

  // Calculate the maximum possible radius
  const maxRadius = Math.min(width, height) / 2;

  return [
    // Move to the start point, considering top left radius
    `M ${Math.min(topLeftRadius, maxRadius)} 0`,
    // Draw a horizontal line to the top right corner, considering top right radius
    `H ${width - Math.min(topRightRadius, maxRadius)}`,
    // Draw an arc for top right corner if radius is greater than 0
    topRightRadius > 0
      ? `A ${Math.min(topRightRadius, maxRadius)} ${Math.min(
          topRightRadius,
          maxRadius
        )} 0 0 1 ${width} ${Math.min(topRightRadius, maxRadius)}`
      : null,
    // Draw a vertical line to the bottom right corner, considering bottom right radius
    `V ${height - Math.min(bottomRightRadius, maxRadius)}`,
    // Draw an arc for bottom right corner if radius is greater than 0
    bottomRightRadius > 0
      ? `A ${Math.min(bottomRightRadius, maxRadius)} ${Math.min(
          bottomRightRadius,
          maxRadius
        )} 0 0 1 ${width - Math.min(bottomRightRadius, maxRadius)} ${height}`
      : null,
    // Draw a horizontal line to the bottom left corner, considering bottom left radius
    `H ${Math.min(bottomLeftRadius, maxRadius)}`,
    // Draw an arc for bottom left corner if radius is greater than 0
    bottomLeftRadius > 0
      ? `A ${Math.min(bottomLeftRadius, maxRadius)} ${Math.min(
          bottomLeftRadius,
          maxRadius
        )} 0 0 1 0 ${height - Math.min(bottomLeftRadius, maxRadius)}`
      : null,
    // Draw a vertical line to the top left corner, considering top left radius
    `V ${Math.min(topLeftRadius, maxRadius)}`,
    // Draw an arc for top left corner if radius is greater than 0
    topLeftRadius > 0
      ? `A ${Math.min(topLeftRadius, maxRadius)} ${Math.min(
          topLeftRadius,
          maxRadius
        )} 0 0 1 ${Math.min(topLeftRadius, maxRadius)} 0`
      : null,
    // Close the path
    'Z',
  ]
    .filter(notEmpty)
    .join(' ');
}
