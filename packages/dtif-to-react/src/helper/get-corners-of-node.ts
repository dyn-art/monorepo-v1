import { TNode } from '@pda/dtif-types';
import { TPoint } from '../types';
import { rotate } from './rotate';

/**
 * Helper function to get the coordinates of all four corners of a given node.
 * This function accounts for the rotation of the component.
 *
 * @param node - The component to get the node of. This component must have a 'relativeTransform' attribute for position and a 'size' attribute for dimensions.
 * @param nodeRotation - The rotation of the component in degrees.
 * @returns An object with the coordinates of each corner: 'topLeft', 'topRight', 'bottomLeft', and 'bottomRight'.
 */
export function getCornersOfNode(
  node: TNode,
  nodeRotation: number
): { [key: string]: TPoint } {
  // Retrieve the top-left corner directly from the component's relative transform
  const topLeft: TPoint = { x: node.transform[0][2], y: node.transform[1][2] };

  // To get the top-right corner, rotate the component's width around the top-left corner
  const topRight = rotate(
    topLeft,
    { x: topLeft.x + node.width, y: topLeft.y },
    -nodeRotation
  );

  // To get the bottom-right corner, rotate the component's height around the top-right corner
  const bottomRight = rotate(
    topRight,
    { x: topRight.x, y: topRight.y + node.height },
    -nodeRotation
  );

  // To get the bottom-left corner, rotate the negative component's width around the bottom-right corner
  const bottomLeft = rotate(
    bottomRight,
    { x: bottomRight.x - node.width, y: bottomRight.y },
    -nodeRotation
  );

  return {
    topLeft: topLeft,
    topRight: topRight,
    bottomLeft: bottomLeft,
    bottomRight: bottomRight,
  };
}
