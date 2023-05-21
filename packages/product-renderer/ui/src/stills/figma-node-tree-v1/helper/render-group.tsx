import { TGroupNode } from '@pda/shared-types';
import { getIdentifier } from './get-identifier';
import { renderNode } from './render-node';

export async function renderGroup(node: TGroupNode): Promise<JSX.Element> {
  return (
    <div
      {...getIdentifier(node)}
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
