import { TFrameNode, TScene } from '@pda/dtif-types';
import { formatNode } from '.';

export async function formatFrameToScene(
  node: FrameNode | ComponentNode | InstanceNode,
  options: TFormatNodeOptions
): Promise<TScene> {
  // Format the node
  let formattedNode = (await formatNode(node, options, true)) as TFrameNode;

  // Reset top level transform related node properties
  formattedNode = {
    ...formattedNode,
    relativeTransform: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  };

  return {
    version: '1.0',
    name: `${formattedNode.name} Scene`,
    root: formattedNode,
    height: formattedNode.height,
    width: formattedNode.width,
  };
}

export type TFormatNodeOptions = {
  frameToSVG?: boolean;
  svgExportIdentifierRegex?: string | null; // Note RegExp can't be passed to the Javascript Sandbox
  gradientToSVG?: boolean;
  ignoreInvisible?: boolean;
  inlineSVG?: boolean;
  uploadStaticData?: (
    key: string,
    data: Uint8Array,
    contentType?: TContentType
  ) => Promise<string>;
};

export type TContentType = {
  name: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/svg+xml' | 'image/gif' | string;
  ending: string;
};
