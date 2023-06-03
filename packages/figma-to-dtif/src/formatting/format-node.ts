import { ESupportedFigmaNodeTypes, TNode, TSVGNode } from '@pda/dtif-types';
import { UnsupportedFigmaNodeException } from '../exceptions';
import { IncompatibleNodeException } from '../exceptions/IncompatibleNodeException';
import { isSVGCompatibleNode, isSVGNode } from '../helper';
import { logger } from '../logger';
import { formatFrameNode } from './format-frame-node';
import { formatGroupNode } from './format-group-node';
import { formatRectangleNode } from './format-rectangle-node';
import { formatTextNode } from './format-text-node';
import { formatToSvgNode } from './format-to-svg-node';

export async function formatNode(
  node: SceneNode,
  options: TFormatNodeOptions,
  isParent = true
): Promise<TNode> {
  const { frameToSVG = true, svgExportIdentifierRegex = null } = options;

  // Check whether Figma node is supported by DTIF
  if (
    !Object.values(ESupportedFigmaNodeTypes).includes(
      node.type as ESupportedFigmaNodeTypes
    )
  ) {
    throw new UnsupportedFigmaNodeException(
      `The Figma node '${node.type}' is not yet supported!`
    );
  }

  // Handle special SVG formatting if applicable
  const svgNode = await handleSpecialSVGFormat({
    node,
    svgExportIdentifierRegex,
    isParent,
    frameToSVG,
    options,
  });
  if (svgNode != null) return svgNode;

  return handleSupportedNodeFormatting(node, options);
}

async function handleSupportedNodeFormatting(
  node: SceneNode,
  options: TFormatNodeOptions
): Promise<TNode> {
  switch (node.type) {
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      return formatFrameNode(node, options);
    case 'GROUP':
      return formatGroupNode(node, options);
    case 'TEXT':
      return formatTextNode(node, options);
    case 'RECTANGLE':
      return formatRectangleNode(node, options);
    case 'LINE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'BOOLEAN_OPERATION':
      return formatToSvgNode(node, options);
    default:
      throw new UnsupportedFigmaNodeException(
        `The Figma node '${node.type}' is not yet supported!`
      );
  }
}

async function handleSpecialSVGFormat(args: {
  node: SceneNode;
  svgExportIdentifierRegex: string | null;
  isParent: boolean;
  frameToSVG: boolean;
  options: TFormatNodeOptions;
}): Promise<TSVGNode | null> {
  const { node, svgExportIdentifierRegex, isParent, frameToSVG, options } =
    args;

  // Check if the node is SVG compatible
  if (!isSVGCompatibleNode(node)) {
    throw new IncompatibleNodeException(
      `Node '${node.name}' can not be formatted to SVG!`
    );
  }

  // Check if the node name matches SVG export identifier regex
  let matchesSvgExportIdentifier = false;
  if (svgExportIdentifierRegex != null) {
    const svgExportIdentifier = new RegExp(svgExportIdentifierRegex);
    matchesSvgExportIdentifier = svgExportIdentifier.test(node.name);
  }

  const isFrame = ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type);

  // Format node to svg node
  if (
    (matchesSvgExportIdentifier || (!isParent && isFrame && frameToSVG)) &&
    !isSVGNode(node)
  ) {
    logger.info(`Export node '${node.name}' as SVG.'`, {
      isParent,
      frameToSVG: frameToSVG,
      svgExportIdentifierRegex: svgExportIdentifierRegex,
    });
    return formatToSvgNode(node, options);
  }

  return null;
}

export type TFormatNodeOptions = {
  frameToSVG?: boolean;
  svgExportIdentifierRegex?: string | null; // Note RegExp can't be passed to the Javascript Sandbox
  bucket: TBucketConfig;
};

export type TBucketConfig = {
  getPresignedUrl: (
    key: string,
    scope: string,
    contentType: string
  ) => Promise<{ key: string; uploadUrl: string }>;
};
