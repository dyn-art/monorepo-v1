import { TTextNode } from '@pda/shared-types';
import { matrixToCSS } from './matrix-to-css';

export function renderText(node: TTextNode) {
  return (
    <div
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
      }}
    >
      {node.characters}
    </div>
  );
}
