import { TTextNode } from '@pda/shared-types';
import WebFont from 'webfontloader';
import { getFillStyles } from './get-fill-styles';
import { matrixToCSS } from './matrix-to-css';

export async function renderText(node: TTextNode): Promise<JSX.Element> {
  const fontFamily = node.fontName.family || 'Roboto';
  const fontWeight = node.fontWeight || 400;

  WebFont.load({
    google: {
      families: [`${fontFamily}:${fontWeight}`],
    },
  });

  return (
    <div
      key={node.id}
      style={{
        position: 'absolute',
        width: node.width,
        height: node.height,
        transform: `${matrixToCSS(node.transform)} rotate(${node.rotation}deg)`,
        transformOrigin: '0 0',
        opacity: node.opacity,
        fontFamily: node.fontName.family,
        fontStyle: node.fontName.style,
        fontSize: node.fontSize,
        fontWeight: node.fontWeight,
        letterSpacing: `${node.letterSpacing.value}${
          node.letterSpacing.unit === 'PIXELS' ? 'px' : '%'
        }`,
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
