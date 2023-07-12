// ============================================================================
// Node
// ============================================================================

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

// ============================================================================
// Formatting Options
// ============================================================================

export type TFormatNodeOptions = {
  /**
   * Whether to disregard nodes that are not visible.
   */
  ignoreInvisible?: boolean;
  /**
   * Export SVG options.
   */
  svg?: TSVGOptions;
  /**
   * Export gradient fill options.
   */
  gradientFill?: TFormatGradientFillOptions;
  /**
   * Export image fill options.
   */
  imageFill?: TFormatImageFillOptions;
  /**
   * Frame node in which temporarily created nodes are placed.
   * So in case of an error the user knows where the nodes came frame
   * and that they can be deleted.
   *
   * If not specified temporary created nodes are placed at the root of the document.
   */
  tempFrameNode?: FrameNode;
};

export type TSVGOptions = {
  inline?: boolean;
  exportIdentifierRegex?: string | null; // String as no (RegExp) class can be passed to the Javascript Sandbox
  frameToSVG?: boolean;
  exportOptions?: {
    format?: ExportSettings['format'];
    uploadStaticData?: TUploadStaticData;
  };
};

export type TFormatGradientFillOptions = {
  inline?: boolean;
  exportOptions?: {
    format?: ExportSettings['format'];
    uploadStaticData?: TUploadStaticData;
  };
};

export type TFormatImageFillOptions = {
  uploadStaticData?: TUploadStaticData;
};

export type TUploadStaticData = (
  key: string,
  data: Uint8Array,
  contentType?: TContentType
) => Promise<string>;

export type TContentType = {
  name: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/svg+xml' | 'image/gif' | string;
  ending: string;
};
