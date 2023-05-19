export function figmaTransformToCSS(props: {
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
}) {
  const { width, height, x, y, rotation } = props;

  // Calculate the effective position after rotation
  const effectiveRotation = rotation;
  const angleRad = effectiveRotation * (Math.PI / 180);
  const effectiveX =
    x -
    (width / 2) * (1 - Math.cos(angleRad)) +
    (height / 2) * Math.sin(angleRad);
  const effectiveY =
    y -
    (height / 2) * (1 - Math.cos(angleRad)) -
    (width / 2) * Math.sin(angleRad);

  return `translate(${effectiveX}px, ${effectiveY}px) rotate(${effectiveRotation}deg)`;
}
