import { TNode, TTransform } from '@pda/dtif-types';
import { formatNode } from './formatting';

export async function formatNodeToDTIF(
  node: SceneNode,
  config: TFormatNodeConfig
): Promise<TNode> {
  // Format the node
  const toExportNode = await formatNode(node, config, true);

  // Reset top level position node properties
  return {
    ...toExportNode,
    x: 0,
    y: 0,
    rotation: 0,
    transform: toExportNode.transform.map((row) => [
      row[0],
      row[1],
      0,
    ]) as TTransform,
  };
}

export type TFormatNodeConfig = {
  frameToSVG?: boolean;
  svgExportIdentifierRegex?: string | null; // Note RegExp can't be passed to the Javascript Sandbox
  uploadStaticData: (
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
