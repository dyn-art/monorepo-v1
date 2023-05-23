import { TRectangleNode } from '@pda/shared-types';
import { figmaBlendModeToCSS } from './figma-blend-mode-to-css';
import { figmaEffectToCSS } from './figma-effect-to-css';
import { figmaFillToCSS } from './figma-fill-to-css';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getIdentifier } from './get-identifier';

export async function renderRectangle(
  node: TRectangleNode
): Promise<JSX.Element> {
  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: node.width,
        height: node.height,
        borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
        transform: figmaTransformToCSS(node),
        transformOrigin: 'center center',
        opacity: node.opacity,
        ...figmaFillToCSS(node.fills, node),
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
      }}
    />
  );
}
