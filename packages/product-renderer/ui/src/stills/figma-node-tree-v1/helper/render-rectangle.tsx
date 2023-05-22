import { TRectangleNode } from '@pda/shared-types';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getFillStyles } from './get-fill-styles';
import { getIdentifier } from './get-identifier';

export async function renderRectangle(
  node: TRectangleNode
): Promise<JSX.Element> {
  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: node.width,
        height: node.height,
        borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
        transform: figmaTransformToCSS(node),
        transformOrigin: 'center center',
        opacity: node.opacity,
        ...getFillStyles(node.fills, node),
      }}
    />
  );
}
