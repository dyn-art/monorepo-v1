import { TGroupNode } from '@pda/shared-types';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { renderNode } from './render-node';

export async function renderGroup(node: TGroupNode): Promise<JSX.Element> {
  return (
    <div
      key={node.id}
      style={{
        position: 'absolute',
        width: node.width,
        height: node.height,
        transform: figmaTransformToCSS(node),
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
