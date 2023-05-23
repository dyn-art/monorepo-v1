import { TTextNode } from '@pda/shared-types';
import WebFont from 'webfontloader';
import { figmaBlendModeToCSS } from './figma-blend-mode-to-css';
import { figmaEffectToCSS } from './figma-effect-to-css';
import { figmaFillToCSS } from './figma-fill-to-css';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getIdentifier } from './get-identifier';

export async function renderText(node: TTextNode): Promise<JSX.Element> {
  const fontFamily = node.fontName.family || 'Roboto';
  const fontWeight = node.fontWeight || 400;
  const fontSize = node.fontSize || 12;
  const letterSpacing =
    node.letterSpacing.unit === 'PERCENT'
      ? fontSize * (node.letterSpacing.value / 100)
      : node.letterSpacing.value;

  WebFont.load({
    google: {
      families: [`${fontFamily}:${fontWeight}`],
    },
  });

  return (
    <div
      {...getIdentifier(node)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: node.width,
        height: node.height,
        opacity: node.opacity,
        fontFamily: node.fontName.family,
        fontStyle: node.fontName.style,
        fontSize: node.fontSize,
        fontWeight: node.fontWeight,
        letterSpacing: `${letterSpacing}px`,
        lineHeight:
          node.lineHeight.unit === 'AUTO'
            ? 'normal'
            : `${node.lineHeight.value}${
                node.lineHeight.unit === 'PIXELS' ? 'px' : '%'
              }`,
        textAlign: node.textAlignHorizontal.toLowerCase() as any,
        justifyContent: node.textAlignVertical.toLowerCase(),
        ...figmaTransformToCSS(node),
        ...figmaFillToCSS(node, true),
        ...figmaEffectToCSS(node.effects),
        ...figmaBlendModeToCSS(node.blendMode),
      }}
    >
      {node.characters}
    </div>
  );
}
