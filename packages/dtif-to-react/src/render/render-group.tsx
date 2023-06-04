import { TGroupNode } from '@pda/dtif-types';
import { getIdentifier } from '../helper';
import { figmaBlendModeToCSS, figmaEffectToCSS } from '../to-css';
import { renderNode } from './render-node';

export async function renderGroup(node: TGroupNode): Promise<JSX.Element> {
  return (
    <div
      {...getIdentifier(node)}
      style={{
        opacity: node.opacity,
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
      }}
    >
      {await Promise.all(
        node.children.map(async (child) => await renderNode(child))
      )}
    </div>
  );
}
