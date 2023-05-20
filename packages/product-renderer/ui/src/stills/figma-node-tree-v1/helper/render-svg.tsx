import { TSVGNode } from '@pda/shared-types';
import axios from 'axios';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getS3BucketURLFromHash } from './get-url-from-hash';

export async function renderSVG(node: TSVGNode): Promise<JSX.Element> {
  const svgContent = await getSVGFromHash(node.svgHash);
  if (svgContent == null) return <div>Failed to load SVG</div>;

  const svgStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: figmaTransformToCSS(node, false),
    transformOrigin: 'center center',
    opacity: node.opacity,
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
      key={node.id}
      dangerouslySetInnerHTML={{ __html: updatedSvgContent }}
    />
  );
}

async function getSVGFromHash(hash: string): Promise<string | null> {
  const url = getS3BucketURLFromHash(hash);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.error('Failed to fetch SVG!', e);
  }
  return null;
}
