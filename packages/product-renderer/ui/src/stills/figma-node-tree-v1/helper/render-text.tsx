import { TTextNode } from '@pda/shared-types';
import WebFont from 'webfontloader';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getFillStyles } from './get-fill-styles';

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

  console.log(node.characters, { node });

  return (
    <div
      key={node.id}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: node.width,
        height: node.height,
        transform: figmaTransformToCSS(node),
        transformOrigin: 'center center',
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
        ...getFillStyles(node.fills, true),
      }}
    >
      {node.characters}
    </div>
  );
}
