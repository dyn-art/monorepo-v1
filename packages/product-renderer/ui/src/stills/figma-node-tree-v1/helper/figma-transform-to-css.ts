/**
 * Helper function to convert a Figma transform object to the CSS transform space
 * and return it as CSS string.
 */
export function figmaTransformToCSS(
  props: {
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  },
  rotate = true
) {
  const { width, height, x, y, rotation } = props;

  // Define the effective rotation as the input rotation
  const effectiveRotation = rotation;

  // Convert the rotation from degrees to radians because JavaScript's Math functions operate in radians.
  const angleRad = effectiveRotation * (Math.PI / 180);

  // Define the object's center
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate the displacement due to rotation in relation to the center point of the object
  const displacementX = centerX * (1 - Math.cos(angleRad));
  const displacementY = centerY * (1 - Math.cos(angleRad));

  // Calculate the position displacement due to rotation itself
  const rotateX = centerY * Math.sin(angleRad);
  const rotateY = centerX * Math.sin(angleRad);

  // The effective position of the object after rotation.
  const effectiveX = x - displacementX + rotateX;
  const effectiveY = y - displacementY - rotateY;

  // The returned CSS transform property applies the calculated translation and rotation.
  return `translate(${effectiveX}px, ${effectiveY}px) rotate(${
    rotate
      ? // We negate the rotation to correct for Figma's clockwise rotation
        -effectiveRotation
      : 0
  }deg)`;
}
