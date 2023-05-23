import React from 'react';

/**
 * Helper function to convert a Figma transform object into the CSS transform space
 * and return it as equivalent CSS string.
 *
 * @param props - The transformation properties from Figma node.
 * @param rotate - Optional flag to apply rotation. Default is true.
 * @returns An object representing the CSS properties equivalent to the Figma transform.
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
): React.CSSProperties {
  const { width, height, x, y, rotation } = props;

  // Define the effective rotation as the input rotation
  const effectiveRotation = rotation;

  // Convert the rotation from degrees to radians
  // because JavaScript's Math functions operate in radians.
  const angle = effectiveRotation * (Math.PI / 180);

  // Define the object's center
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate the displacement due to rotation in relation to the center point of the object
  const displacementX = centerX * (1 - Math.cos(angle));
  const displacementY = centerY * (1 - Math.cos(angle));

  // Calculate the position displacement due to rotation itself
  const rotateX = centerY * Math.sin(angle);
  const rotateY = centerX * Math.sin(angle);

  // The effective position of the object after rotation.
  const effectiveX = x - displacementX + rotateX;
  const effectiveY = y - displacementY - rotateY;

  // The returned CSS transform property applies the calculated translation and rotation.
  return {
    transform: `translate(${effectiveX}px, ${effectiveY}px) rotate(${
      rotate
        ? // We negate the rotation to correct for Figma's clockwise rotation
          -effectiveRotation
        : 0
    }deg)`,
    transformOrigin: 'center center',
  };
}
