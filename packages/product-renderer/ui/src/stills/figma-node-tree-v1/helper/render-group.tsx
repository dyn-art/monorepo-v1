import { TGroupNode } from '@pda/shared-types';
import { figmaBlendModeToCSS } from './figma-blend-mode-to-css';
import { figmaEffectToCSS } from './figma-effect-to-css';
import { getIdentifier } from './get-identifier';
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
