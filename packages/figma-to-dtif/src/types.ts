export type TSVGCompatibleNode =
  | LineNode
  | EllipseNode
  | PolygonNode
  | StarNode
  | VectorNode
  | BooleanOperationNode
  | GroupNode
  | FrameNode
  | RectangleNode
  | InstanceNode
  | ComponentNode;

export type TNodeWithFills =
  | RectangleNode
  | FrameNode
  | ComponentNode
  | InstanceNode
  | TextNode;
