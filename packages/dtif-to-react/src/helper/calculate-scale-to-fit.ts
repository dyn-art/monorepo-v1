export function calculateScaleToFit(
  original: Dimensions,
  target: Dimensions,
  padding = 0
): number | null {
  // Check whether padding is to large to fit into the target rectangle
  if (padding * 2 >= target.width || padding * 2 >= target.height) {
    return null;
  }

  const targetWidth = target.width - padding * 2;
  const targetHeight = target.height - padding * 2;
  const widthScale = targetWidth / original.width;
  const heightScale = targetHeight / original.height;

  // Use the smaller scale to ensure the original component fits entirely within the target rectangle.
  return Math.min(widthScale, heightScale);
}

type Dimensions = {
  width: number;
  height: number;
};
