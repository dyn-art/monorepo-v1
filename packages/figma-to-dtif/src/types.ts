type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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

// ============================================================================
// Transform Options
// ============================================================================

export type TTransformNodeOptions = {
  /**
   * Whether to disregard nodes that are not visible.
   */
  ignoreInvisible?: boolean;
  /**
   * Transform to SVG options.
   */
  svg?: TSVGOptions;
  /**
   * Transform gradient fill options.
   */
  gradientFill?: TTransformGradientFillOptions;
  /**
   * Transform image fill options.
   */
  imageFill?: TTransformImageFillOptions;
  /**
   * Transform font options.
   */
  font?: TTransformFontOptions;
  /**
   * Temporary container node to contain nodes that need to be cloned during export temporarily (e.g. SVG).
   * It servers for the user as context so that no non user created nodes are randomly flying around.
   *
   * If not specified temporary created nodes are placed at the root of the document.
   */
  exportContainerNode?: FrameNode;
};

export type TSVGOptions = {
  identifierRegex?: string | null; // String as (RegExp) class can't be passed to the Javascript Sandbox
  frameToSVG?: boolean;
  inline?: boolean;
  exportOptions?: TExportOptions;
};

export type TTransformGradientFillOptions = {
  exportOptions?: TExportOptions;
};

export type TTransformImageFillOptions = {
  exportOptions?: TExportOptions;
};

export type TTransformFontOptions = {
  exportOptions?: TExportOptions;
};

export type TContentType = {
  name: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/svg+xml' | 'image/gif' | string;
  ending: string;
};

export type TUploadStaticData = (
  key: string,
  data: Uint8Array,
  contentType?: TContentType
) => Promise<string>;

export type TExportOptions = {
  inline: boolean;
  format?: ExportSettings['format'];
  uploadStaticData?: TUploadStaticData;
};
