import { TSVGNode } from '@pda/dtif-types';
import { TSVGCompatibleNode } from '../utils';
import { TNodeWithFills } from './handle-fills';

// ============================================================================
// Figma
// ============================================================================

export function isFrameNode(node: any): node is FrameNode {
  return node?.type === 'FRAME';
}

export function isGroupNode(node: any): node is GroupNode {
  return node?.type === 'GROUP';
}

export function isRectangleNode(node: any): node is RectangleNode {
  return node?.type === 'RECTANGLE';
}

export function isLineNode(node: any): node is LineNode {
  return node?.type === 'LINE';
}

export function isEllipseNode(node: any): node is EllipseNode {
  return node?.type === 'ELLIPSE';
}

export function isPolygonNode(node: any): node is PolygonNode {
  return node?.type === 'POLYGON';
}

export function isStarNode(node: any): node is StarNode {
  return node?.type === 'STAR';
}

export function isVectorNode(node: any): node is VectorNode {
  return node?.type === 'VECTOR';
}

export function isTextNode(node: any): node is TextNode {
  return node?.type === 'TEXT';
}

export function isBooleanOperationNode(
  node: any
): node is BooleanOperationNode {
  return node?.type === 'BOOLEAN_OPERATION';
}

export function isInstanceNode(node: any): node is InstanceNode {
  return node?.type === 'INSTANCE';
}

export function isComponentNode(node: any): node is ComponentNode {
  return node?.type === 'COMPONENT';
}

export function isSVGNode(value: any): value is TSVGNode {
  return value.type === 'SVG';
}

// ============================================================================
// General
// ============================================================================

export function isSVGCompatibleNode(node: unknown): node is TSVGCompatibleNode {
  return (
    isLineNode(node) ||
    isEllipseNode(node) ||
    isPolygonNode(node) ||
    isStarNode(node) ||
    isVectorNode(node) ||
    isBooleanOperationNode(node) ||
    isGroupNode(node) ||
    isFrameNode(node) ||
    isRectangleNode(node) ||
    isInstanceNode(node) ||
    isComponentNode(node) ||
    isTextNode(node)
  );
}

export function isNodeWithFills(node: unknown): node is TNodeWithFills {
  return (
    isRectangleNode(node) ||
    isFrameNode(node) ||
    isComponentNode(node) ||
    isInstanceNode(node) ||
    isTextNode(node)
  );
}
