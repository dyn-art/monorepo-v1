import { TNode, TSVGNode, TSupportedFigmaNodeTypes } from '@pda/types/dtif';
import {
  IncompatibleSVGNodeException,
  InvisibleNodeException,
  UnsupportedFigmaNodeException,
} from '../exceptions';
import { TFormatNodeOptions } from '../types';
import { isSVGCompatibleNode } from '../utils';
import { formatEllipseNode } from './format-ellipse-node';
import { formatFrameNode } from './format-frame-node';
import { formatGroupNode } from './format-group-node';
import { formatPolygonNode } from './format-polygon-node';
import { formatRectangleNode } from './format-rectangle-node';
import { formatStarNode } from './format-star-node';
import { formatTextNode } from './format-text-node';
import { formatToSVGNode } from './format-to-svg-node';

export const supportedNodeTypes: TSupportedFigmaNodeTypes[] = [
  'FRAME',
  'COMPONENT',
  'INSTANCE',
  'GROUP',
  'TEXT',
  'RECTANGLE',
  'LINE',
  'ELLIPSE',
  'POLYGON',
  'STAR',
  'VECTOR',
  'BOOLEAN_OPERATION',
];

export async function formatNode(
  node: SceneNode,
  options: TFormatNodeOptions
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
      `Node '${node.name}' couldn't be exported because it is invisible.`,
      node
    );
  }
  // If invisible node to be exported, make it visible during export to avoid unwanted errors
  else if (!isVisible) {
    node.visible = true;
  }

  try {
    // Check whether Figma node is supported by DTIF
    if (!supportedNodeTypes.includes(node.type as TSupportedFigmaNodeTypes)) {
      throw new UnsupportedFigmaNodeException(
        `The Figma node '${node.name}' of the type '${node.type}' is not supported yet!`,
        node
      );
    }

    // Handle special SVG formatting if applicable
    if (
      shouldExportNodeAsSVG(node, {
        svgExportIdentifierRegex,
        frameToSVG,
      })
    ) {
      formattedNode = await handleSpecialSVGFormatting(node, options);
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
    case 'ELLIPSE':
      return formatEllipseNode(node, options);
    case 'POLYGON':
      return formatPolygonNode(node, options);
    case 'STAR':
      return formatStarNode(node, options);
    case 'LINE':
    case 'VECTOR':
    case 'BOOLEAN_OPERATION':
      return formatToSVGNode(node, {
        ...options.svg,
        tempFrameNode: options.tempFrameNode,
      });
    default:
      throw new UnsupportedFigmaNodeException(
        `The Figma node '${node.type}' is not yet supported!`,
        node
      );
  }
}

async function handleSpecialSVGFormatting(
  node: SceneNode,
  options: TFormatNodeOptions
): Promise<TSVGNode> {
  // Check if the node is SVG compatible
  if (!isSVGCompatibleNode(node)) {
    throw new IncompatibleSVGNodeException(
      `Node '${node.name}' can not be formatted to SVG!`,
      node
    );
  }

  return formatToSVGNode(node, {
    ...options.svg,
    tempFrameNode: options.tempFrameNode,
  });
}

function shouldExportNodeAsSVG(
  node: SceneNode,
  config: {
    svgExportIdentifierRegex: string | null;
    frameToSVG: boolean;
  }
): boolean {
  const { svgExportIdentifierRegex, frameToSVG } = config;
  const isFrame = ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type);

  // Check if the node name matches SVG export identifier regex
  const matchesSvgExportIdentifier = matchesSVGExportIdentifierRegex(
    svgExportIdentifierRegex,
    node
  );

  // Check if frame node should be exported as SVG
  const shouldExportFrameAsSVG = isFrame && frameToSVG;

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
