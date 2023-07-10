import { notEmpty } from '@pda/utils';

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

  return [
    // Move to the start point, considering top left radius
    `M ${topLeftRadius} 0`,
    // Draw a horizontal line to the top right corner, considering top right radius
    `H ${width - topRightRadius}`,
    // Draw an arc for top right corner if radius is greater than 0
    topRightRadius > 0
      ? `A ${topRightRadius} ${topRightRadius} 0 0 1 ${width} ${topRightRadius}`
      : null,
    // Draw a vertical line to the bottom right corner, considering bottom right radius
    `V ${height - bottomRightRadius}`,
    // Draw an arc for bottom right corner if radius is greater than 0
    bottomRightRadius > 0
      ? `A ${bottomRightRadius} ${bottomRightRadius} 0 0 1 ${
          width - bottomRightRadius
        } ${height}`
      : null,
    // Draw a horizontal line to the bottom left corner, considering bottom left radius
    `H ${bottomLeftRadius}`,
    // Draw an arc for bottom left corner if radius is greater than 0
    bottomLeftRadius > 0
      ? `A ${bottomLeftRadius} ${bottomLeftRadius} 0 0 1 0 ${
          height - bottomLeftRadius
        }`
      : null,
    // Draw a vertical line to the top left corner, considering top left radius
    `V ${topLeftRadius}`,
    // Draw an arc for top left corner if radius is greater than 0
    topLeftRadius > 0
      ? `A ${topLeftRadius} ${topLeftRadius} 0 0 1 ${topLeftRadius} 0`
      : null,
    // Close the path
    'Z',
  ]
    .filter(notEmpty)
    .join(' ');
}
