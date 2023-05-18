import { TRectangleNode } from '@pda/shared-types';
import { getFillStyles } from './get-fill-styles';
import { matrixToCSS } from './matrix-to-css';

export async function renderRectangle(
  node: TRectangleNode
): Promise<JSX.Element> {
  return (
    <div
      key={node.id}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: node.width,
        height: node.height,
        borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
        transform: `${matrixToCSS(node.transform)}`,
        transformOrigin: '50% 50%',
        opacity: node.opacity,
        ...getFillStyles(node.fills),
      }}
    />
  );
}
