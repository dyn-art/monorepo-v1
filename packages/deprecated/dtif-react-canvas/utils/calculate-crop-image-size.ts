export function calculateCropImageSize(
  container: {
    width: number;
    height: number;
  },
  image: {
    width: number;
    height: number;
  }
): { width: number; height: number } {
  let newWidth: number;
  let newHeight: number;

  // Calculate ratio
  const containerRatio = container.width / container.height;
  const imageRatio = image.width / image.height;

  // Apply ratio to new width and height
  if (imageRatio > containerRatio) {
    newHeight = container.height;
    newWidth = newHeight * imageRatio;
  } else {
    newWidth = container.width;
    newHeight = newWidth / imageRatio;
  }

  return { width: newWidth, height: newHeight };
}
