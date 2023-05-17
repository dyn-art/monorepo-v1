import { TGroupNode } from '@pda/shared-types';
import { matrixToCSS } from './matrix-to-css';
import { renderNode } from './render-node';

export async function renderGroup(node: TGroupNode): Promise<JSX.Element> {
  return (
    <div
      style={{
        position: 'absolute',
        width: node.width,
        height: node.height,
        transform: `${matrixToCSS(node.transform)} rotate(${node.rotation}deg)`,
        transformOrigin: '0 0',
        opacity: node.opacity,
      }}
    >
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
