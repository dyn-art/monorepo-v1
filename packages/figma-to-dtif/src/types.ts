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
  ignoreInvisible?: boolean;
  svg?: TSVGOptions;
  gradientFill?: TFormatGradientFillOptions;
  imageFill?: TFormatImageFillOptions;
};

export type TSVGOptions = {
  inline?: boolean;
  exportIdentifierRegex?: string | null; // String as no (RegExp) class can be passed to the Javascript Sandbox
  frameToSVG?: boolean;
  exportOptions?: {
    svgToRaster?: boolean;
    uploadStaticData?: TUploadStaticData;
  };
};

export type TFormatGradientFillOptions = {
  inline?: boolean;
  exportOptions?: {
    format?: 'SVG' | 'JPG';
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
