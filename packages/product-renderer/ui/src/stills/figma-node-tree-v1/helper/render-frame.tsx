import { TFrameNode } from '@pda/shared-types';
import { getFillStyles } from './get-fill-styles';
import { matrixToCSS } from './matrix-to-css';
import { renderNode } from './render-node';

export async function renderFrame(node: TFrameNode): Promise<JSX.Element> {
  return (
    <div
      style={{
        position: 'relative',
        width: node.width,
        height: node.height,
        overflow: node.clipsContent ? 'hidden' : 'visible',
        transform: `${matrixToCSS(node.transform)} rotate(${node.rotation}deg)`,
        transformOrigin: '0 0',
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
