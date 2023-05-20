import { TSVGNode } from '@pda/shared-types';
import axios from 'axios';
import { ReactSVG } from 'react-svg';
import { figmaTransformToCSS } from './figma-transform-to-css';
import { getS3BucketURLFromHash } from './get-url-from-hash';

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
  const svgContent = await getSVGFromHash(node.svgHash);
  if (svgContent) {
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
  } else {
    return <div>Failed to load SVG</div>;
  }

  return (
    <ReactSVG
      key={node.id}
      src={getS3BucketURLFromHash(node.svgHash)}
      beforeInjection={(svg) => {
        svg.setAttribute(
          'style',
          Object.entries({
            position: 'absolute',
            top: 0,
            left: 0,
            width: node.width,
            height: node.height,
            transform: figmaTransformToCSS(node, false),
            transformOrigin: 'center center',
            opacity: node.opacity,
          })
            .map(([key, value]) => `${key}:${value}`)
            .join('; ')
        );
      }}
      loading={() => <span>Loading...</span>}
      renumerateIRIElements={false}
    />
  );

  // return (
  //   <img
  //     src={getS3BucketURLFromHash(node.svgHash)}
  //     style={{
  //       position: 'absolute',
  //       top: 0,
  //       left: 0,
  //       width,
  //       height,
  //       transform: figmaTransformToCSS(node, false),
  //       transformOrigin: 'center center',
  //       opacity: node.opacity,
  //     }}
  //   />
  // );
}
