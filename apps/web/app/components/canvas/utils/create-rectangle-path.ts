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
    `M ${topLeftRadius},0`,
    `h ${width - topRightRadius - topLeftRadius}`,
    `q ${topRightRadius},0 ${topRightRadius},${topRightRadius}`,
    `v ${height - topRightRadius - bottomRightRadius}`,
    `q 0,${bottomRightRadius} -${bottomRightRadius},${bottomRightRadius}`,
    `h -${width - bottomRightRadius - bottomLeftRadius}`,
    `q -${bottomLeftRadius},0 -${bottomLeftRadius},-${bottomLeftRadius}`,
    `v -${height - bottomLeftRadius - topLeftRadius}`,
    `q 0,-${topLeftRadius} ${topLeftRadius},-${topLeftRadius}`,
    'Z',
  ].join(' ');
}
