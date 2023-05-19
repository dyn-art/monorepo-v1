import { TFrameNode } from '@pda/shared-types';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getFillStyles } from './get-fill-styles';
import { renderNode } from './render-node';

export async function renderFrame(node: TFrameNode): Promise<JSX.Element> {
  return (
    <div
      key={node.id}
      style={{
        position: 'relative',
        width: node.width,
        height: node.height,
        overflow: node.clipsContent ? 'hidden' : 'visible',
        transform: figmaTransformToCSS(node),
        transformOrigin: 'center center',
        opacity: node.opacity,
        ...getFillStyles(node.fills),
      }}
    >
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
