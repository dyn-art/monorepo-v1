import { TSVGNode } from '@pda/dtif-types';
import { getIdentifier, getS3BucketURLFromHash } from '../helper';
import { figmaTransformToCSS } from '../to-css';

export async function renderSVG(node: TSVGNode): Promise<JSX.Element> {
  const svgContent = await getSVGFromHash(node.svgHash);
  if (svgContent == null) return <div>Failed to load SVG</div>;

  const svgStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: node.opacity,
    ...figmaTransformToCSS(node, false),
  };

  // Convert style object to string
  const styleString = Object.entries(svgStyles)
    .map(([key, value]) => `${key}:${value}`)
    .join('; ');

  const updatedSvgContent = svgContent.replace(
    '<svg',
    `<svg style="${styleString}"`
  );

  return (
    <div
      {...getIdentifier(node)}
      dangerouslySetInnerHTML={{ __html: updatedSvgContent }}
    />
  );
}

async function getSVGFromHash(hash: string): Promise<string | null> {
  const url = getS3BucketURLFromHash(hash);
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch SVG!', e);
  }
  return null;
}
