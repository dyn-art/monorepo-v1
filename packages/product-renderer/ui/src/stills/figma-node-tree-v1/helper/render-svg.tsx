import { TSVGNode } from '@pda/shared-types';
import axios from 'axios';
import { getS3BucketURLFromHash } from './get-url-from-hash';
import { matrixToCSS } from './matrix-to-css';

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

export async function renderSVG(node: TSVGNode): Promise<JSX.Element> {
  // const svgContent = await getSVGFromHash(node.svgHash);
  // return (
  //   <div
  //     key={node.id}
  //     dangerouslySetInnerHTML={{ __html: svgContent ?? '' }}
  //     style={{
  //       position: 'absolute',
  //       width: node.width,
  //       height: node.height,
  //       transform: `${matrixToCSS(node.transform)} rotate(${node.rotation}deg)`,
  //       transformOrigin: '0 0',
  //       opacity: node.opacity,
  //     }}
  //   />
  // );
  return (
    <img
      src={getS3BucketURLFromHash(node.svgHash)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        // width: node.width,
        // height: node.height,
        transform: `${matrixToCSS(node.transform)} rotate(${node.rotation}deg)`,
        transformOrigin: '0 0',
        opacity: node.opacity,
      }}
    />
  );
}
