import { TGroupNode } from '@pda/shared-types';
import { renderNode } from './render-node';

export async function renderGroup(node: TGroupNode): Promise<JSX.Element> {
  return (
    <div
      key={node.id}
      style={{
        opacity: node.opacity,
      }}
    >
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
