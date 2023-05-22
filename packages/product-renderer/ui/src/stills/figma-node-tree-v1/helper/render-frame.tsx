import { TFrameNode } from '@pda/shared-types';
import { figmaEffectToCSS } from './figma-effect-to-css';
import { figmaFillToCSS } from './figma-fill-to-css';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getIdentifier } from './get-identifier';
import { renderNode } from './render-node';

export async function renderFrame(node: TFrameNode): Promise<JSX.Element> {
  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        width: node.width,
        height: node.height,
        overflow: node.clipsContent ? 'hidden' : 'visible',
        transform: figmaTransformToCSS(node),
        transformOrigin: 'center center',
        opacity: node.opacity,
        ...figmaFillToCSS(node.fills, node),
        ...figmaEffectToCSS(node.effects),
      }}
    >
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
