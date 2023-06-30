import { ESupportedFigmaNodeTypes, TNode, TSVGNode } from '@pda/dtif-types';
import {
  IncompatibleSVGNodeException,
  InvisibleNodeException,
  UnsupportedFigmaNodeException,
} from '../exceptions';
import { logger } from '../logger';
import { TFormatNodeOptions } from '../types';
import { isSVGCompatibleNode } from '../utils';
import { formatFrameNode } from './format-frame-node';
import { formatGroupNode } from './format-group-node';
import { formatRectangleNode } from './format-rectangle-node';
import { formatTextNode } from './format-text-node';
import { formatToSvgNode } from './format-to-svg-node';

export async function formatNode(
  node: SceneNode,
  options: TFormatNodeOptions,
  isRoot = true
): Promise<TNode> {
  const {
    svg: {
      frameToSVG = true,
      exportIdentifierRegex: svgExportIdentifierRegex = null,
    } = {},
    ignoreInvisible = true,
  } = options;
  let formattedNode: TNode;

  // Check whether node is visible
  const isVisible = node.visible;
  if (!isVisible && ignoreInvisible) {
    throw new InvisibleNodeException(
      `Node '${node.name}' couldn't be exported because it is probably invisible.`,
      node
    );
  }
  // If invisible node to be exported, make it visible during export to avoid unwanted errors
  else if (!isVisible) {
    node.visible = true;
  }

  try {
    // Check whether Figma node is supported by DTIF
    if (
      !Object.values(ESupportedFigmaNodeTypes).includes(
        node.type as ESupportedFigmaNodeTypes
      )
    ) {
      throw new UnsupportedFigmaNodeException(
        `The Figma node '${node.name}' of the type '${node.type}' is not supported yet!`,
        node
      );
    }

    // Handle special SVG formatting if applicable
    if (
      shouldExportNodeAsSVG({
        node,
        svgExportIdentifierRegex,
        isRoot: isRoot,
        frameToSVG,
      })
    ) {
      formattedNode = await handleSpecialSVGFormatting({
        node,
        svgExportIdentifierRegex,
        isRoot,
        frameToSVG,
        options: options,
      });
    }

    // Handle supported node formatting
    else {
      formattedNode = await handleSupportedNodeFormatting(node, options);
    }

    resetVisibility(node, isVisible);
  } catch (e) {
    resetVisibility(node, isVisible);
    throw e;
  }

  return formattedNode;
}

function resetVisibility(node: SceneNode, isVisible: boolean) {
  if (!isVisible) {
    node.visible = isVisible;
  }
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
      return formatToSvgNode(node, options.svg);
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
  isRoot: boolean;
  frameToSVG: boolean;
  options: TFormatNodeOptions;
}): Promise<TSVGNode> {
  const { node, svgExportIdentifierRegex, isRoot, frameToSVG, options } = args;

  // Check if the node is SVG compatible
  if (!isSVGCompatibleNode(node)) {
    throw new IncompatibleSVGNodeException(
      `Node '${node.name}' can not be formatted to SVG!`,
      node
    );
  }

  logger.info(`Export node '${node.name}' as SVG.'`, {
    isRoot,
    frameToSVG: frameToSVG,
    svgExportIdentifierRegex: svgExportIdentifierRegex,
  });

  return formatToSvgNode(node, options.svg);
}

function shouldExportNodeAsSVG(args: {
  node: SceneNode;
  svgExportIdentifierRegex: string | null;
  isRoot: boolean;
  frameToSVG: boolean;
}): boolean {
  const { node, svgExportIdentifierRegex, isRoot, frameToSVG } = args;
  const isFrame = ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type);

  // Check if the node name matches SVG export identifier regex
  const matchesSvgExportIdentifier = matchesSVGExportIdentifierRegex(
    svgExportIdentifierRegex,
    node
  );

  // Check if frame node should be exported as SVG
  const shouldExportFrameAsSVG = isFrame && frameToSVG && !isRoot;

  return matchesSvgExportIdentifier || shouldExportFrameAsSVG;
}

function matchesSVGExportIdentifierRegex(
  svgExportIdentifierRegex: string | null,
  node: SceneNode
): boolean {
  if (svgExportIdentifierRegex == null) return false;
  const svgExportIdentifier = new RegExp(svgExportIdentifierRegex);
  return svgExportIdentifier.test(node.name);
}
