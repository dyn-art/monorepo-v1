import { TSVGCompatibleNode } from '@/types';
import {
  isBooleanOperationNode,
  isComponentNode,
  isEllipseNode,
  isFrameNode,
  isGroupNode,
  isInstanceNode,
  isLineNode,
  isPolygonNode,
  isRectangleNode,
  isStarNode,
  isTextNode,
  isVectorNode,
} from './is-figma-node';

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
