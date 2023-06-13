import { ESupportedFigmaNodeTypes, TNode, TSVGNode } from '@pda/dtif-types';
import { UnsupportedFigmaNodeException } from '../exceptions';
import { IncompatibleSVGNodeException } from '../exceptions/IncompatibleSVGNodeException';
import { TFormatNodeConfig } from '../format-node-to-dtif';
import { isSVGCompatibleNode, isSVGNode } from '../helper';
import { logger } from '../logger';
import { formatFrameNode } from './format-frame-node';
import { formatGroupNode } from './format-group-node';
import { formatRectangleNode } from './format-rectangle-node';
import { formatTextNode } from './format-text-node';
import { formatToSvgNode } from './format-to-svg-node';

export async function formatNode(
  node: SceneNode,
  config: TFormatNodeConfig,
  isParent = true
): Promise<TNode | null> {
  const {
    frameToSVG = true,
    svgExportIdentifierRegex = null,
    ignoreInvisible = true,
  } = config;
  let formattedNode: TNode | null = null;

  // Check whether node is visible
  const isVisible = node.visible;
  if (!isVisible && ignoreInvisible) {
    return null;
  }
  // If invisible node to be exported, make it visible during export to avoid unwanted errors
  else if (!isVisible) {
    node.visible = true;
  }

  // Check whether Figma node is supported by DTIF
  if (
    !Object.values(ESupportedFigmaNodeTypes).includes(
      node.type as ESupportedFigmaNodeTypes
    )
  ) {
    throw new UnsupportedFigmaNodeException(
      `The Figma node '${node.type}' is not yet supported!`,
      node
    );
  }

  // Handle special SVG formatting if applicable
  if (formattedNode == null) {
    formattedNode = await handleSpecialSVGFormatting({
      node,
      svgExportIdentifierRegex,
      isParent,
      frameToSVG,
      config: config,
    });
  }

  // Handle supported node formatting
  if (formattedNode == null) {
    formattedNode = await handleSupportedNodeFormatting(node, config);
  }

  if (!isVisible) {
    node.visible = isVisible;
    formattedNode.opacity = 0;
  }

  return formattedNode;
}

async function handleSupportedNodeFormatting(
  node: SceneNode,
  config: TFormatNodeConfig
): Promise<TNode> {
  switch (node.type) {
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      return formatFrameNode(node, config);
    case 'GROUP':
      return formatGroupNode(node, config);
    case 'TEXT':
      return formatTextNode(node, config);
    case 'RECTANGLE':
      return formatRectangleNode(node, config);
    case 'LINE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'BOOLEAN_OPERATION':
      return formatToSvgNode(node, config);
    default:
      throw new UnsupportedFigmaNodeException(
        `The Figma node '${node.type}' is not yet supported!`,
        node
      );
  }
}

async function handleSpecialSVGFormatting(args: {
  node: SceneNode;
  svgExportIdentifierRegex: string | null;
  isParent: boolean;
  frameToSVG: boolean;
  config: TFormatNodeConfig;
}): Promise<TSVGNode | null> {
  const { node, svgExportIdentifierRegex, isParent, frameToSVG, config } = args;
  const isFrame = ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type);

  // Check if the node name matches SVG export identifier regex
  let matchesSvgExportIdentifier = false;
  if (svgExportIdentifierRegex != null) {
    const svgExportIdentifier = new RegExp(svgExportIdentifierRegex);
    matchesSvgExportIdentifier = svgExportIdentifier.test(node.name);
  }

  // Format node to svg node
  if (
    (matchesSvgExportIdentifier || (!isParent && isFrame && frameToSVG)) &&
    !isSVGNode(node)
  ) {
    // Check if the node is SVG compatible
    if (!isSVGCompatibleNode(node)) {
      throw new IncompatibleSVGNodeException(
        `Node '${node.name}' can not be formatted to SVG!`,
        node
      );
    }

    logger.info(`Export node '${node.name}' as SVG.'`, {
      isParent,
      frameToSVG: frameToSVG,
      svgExportIdentifierRegex: svgExportIdentifierRegex,
    });

    return formatToSvgNode(node, config);
  }

  return null;
}
