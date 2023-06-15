import { TNode } from '@pda/dtif-types';
import { formatNode } from '.';

export async function formatNodeToDTIF(
  node: SceneNode,
  config: TFormatNodeConfig
): Promise<TNode | null> {
  // Format the node
  const toExportNode = await formatNode(node, config, true);

  // Reset top level position node properties
  return toExportNode != null
    ? {
        ...toExportNode,
        x: 0,
        y: 0,
        rotation: 0,
        transform: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
      }
    : null;
}

export type TFormatNodeConfig = {
  frameToSVG?: boolean;
  svgExportIdentifierRegex?: string | null; // Note RegExp can't be passed to the Javascript Sandbox
  gradientToSVG?: boolean;
  ignoreInvisible?: boolean;
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
