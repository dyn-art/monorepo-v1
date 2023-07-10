// Note: The node types are inspired by Figma's node types.
// https://www.figma.com/plugin-docs/api/nodes

export type TSupportedFigmaNodeTypes =
  | 'FRAME'
  | 'COMPONENT'
  | 'INSTANCE'
  | 'GROUP'
  | 'TEXT'
  | 'RECTANGLE'
  | 'LINE'
  | 'ELLIPSE'
  | 'POLYGON'
  | 'STAR'
  | 'VECTOR'
  | 'BOOLEAN_OPERATION';

export type TNodeTypes =
  | 'FRAME'
  | 'GROUP'
  | 'TEXT'
  | 'RECTANGLE'
  | 'EMBED'
  | 'POLYGON'
  | 'STAR'
  | 'ELLIPSE'
  | 'SVG';

// ============================================================================
// Scene
// ============================================================================

/**
 * Represents the scene or workspace in which all nodes exist.
 */
export type TScene = {
  version: '1.0';
  /**
   * The name of the scene.
   *
   * e.g. 'My super cool scene'
   */
  name: string;
  /**
   * The width of the scene.
   */
  width: number;
  /**
   * The height of the scene.
   */
  height: number;
  /**
   * The root node of the scene.
   */
  root: TFrameNode;
};

// ============================================================================
// Nodes
// ============================================================================

/**
 * The frame node is a container used to define a layout hierarchy.
 * It is similar to <div> in HTML.
 * It is different from GroupNode, which is closer to a folder for layers.
 */
export type TFrameNode = {
  type: 'FRAME';
  /**
   * A boolean indicating whether the frame clips its content to its bounding box.
   */
  clipsContent: boolean;
} & TDefaultShapeMixin &
  TChildrenMixin &
  TRectangleCornerMixin &
  TFillsMixin;

/**
 * The rectangle node is a basic shape node representing a rectangle.
 */
export type TRectangleNode = {
  type: 'RECTANGLE';
} & TDefaultShapeMixin &
  TRectangleCornerMixin &
  TFillsMixin;

/**
 * The SVG node is the most general representation of shape,
 * allowing you to specify individual vertices, segments, and regions.
 *
 * As the name suggest it contains SVG data following the SVG 1.1 standard
 * in either exported or inline form.
 */
export type TSVGNode = TSVGNodeExported | TSVGNodeInline;

/**
 * The SVG node exported represents the SVG node
 * where the SVG content has been exported to an external file.
 */
export type TSVGNodeExported = {
  type: 'SVG';
  /**
   * A boolean flag indicating that the SVG node's content is exported to an external file.
   */
  isExported: true;
  /**
   * The format of the exported file, which can be 'JPG', 'PNG', or 'SVG'.
   */
  format: 'JPG' | 'PNG' | 'SVG';
  /**
   * The hash of the exported file. Used to identifies the file.
   */
  hash: string;
  /**
   * Optional content of the exported file.
   * It can be either an array of bytes that contains the exported file's data inline,
   * or a URL string pointing to the file location.
   *
   * If not set the content can to be searched by the hash.
   */
  content?: Uint8Array | string;
} & TDefaultShapeMixin;

/**
 * The SVG node exported represents the SVG node
 * where the SVG content is inline in form of an array of SVG element children.
 */
export type TSVGNodeInline = {
  type: 'SVG';
  /**
   * A boolean flag indicating that the SVG node's content is inline in the node.
   */
  isExported: false;
  /**
   * An array of SVG element children that define the SVG content.
   */
  children: TSVGElement['children'];
} & TDefaultShapeMixin;

/**
 * The text node represents text where both the whole node
 * or individual character ranges can have properties
 * such as color (fills), font size, font name, etc.
 */
export type TTextNode = {
  type: 'TEXT';
  /**
   * The horizontal alignment of the text with respect to the textbox.
   */
  textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  /**
   * The vertical alignment of the text with respect to the textbox.
   */
  textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
  /**
   * The size of the font. Has minimum value of 1.
   */
  fontSize: number;
  /**
   * The font family (e.g. "Inter"), and font style (e.g. "Regular").
   */
  fontName: TFontName;
  /**
   * The weight of the font (e.g. 400 for "Regular", 700 for "Bold").
   */
  fontWeight: number;
  /**
   * The spacing between the individual characters.
   */
  letterSpacing: TLetterSpacing;
  /**
   * The spacing between the lines in a paragraph of text.
   */
  lineHeight: TLineHeight;
  /**
   * The raw characters in the text node.
   */
  characters: string;
} & TDefaultShapeMixin &
  TFillsMixin;

/**
 * The group node is a container used to semantically group related nodes. You can think of them as a folder in the layers panel.
 * It is different from FrameNode,
 * which defines layout and is closer to a <div> in HTML.
 *
 * Groups are always positioned and sized to fit their content.
 * As such, while you can move or resize a group,
 * you should also expect that a group's position and size will change
 * if you change its content.
 */
export type TGroupNode = {
  type: 'GROUP';
} & TBaseNodeMixin &
  TSceneNodeMixin &
  TChildrenMixin &
  TBlendMixin &
  TLayoutMixin;

/**
 * The ellipse node is a basic shape node representing an ellipse.
 * Note that a circle is an ellipse where width == height.
 */
export type TEllipseNode = {
  type: 'ELLIPSE';
  /**
   * Exposes the values of the sweep
   * and ratio handles used in our UI to create arcs and donuts.
   */
  arcData: TEllipseArcData;
} & TDefaultShapeMixin &
  TFillsMixin;

/**
 * The star node is a basic shape node representing
 * a star with a set number of points.
 */
export type TStarNode = {
  type: 'STAR';
  /**
   * Number of "spikes", or outer points of the star. Must be an integer >= 3.
   */
  pointCount: number;
  /**
   * Ratio of the inner radius to the outer radius.
   */
  innerRadiusRation: number;
} & TDefaultShapeMixin &
  TFillsMixin;

/**
 * The polygon node is a basic shape node representing
 * a regular convex polygon with three or more sides.
 */
export type TPolygonNode = {
  type: 'POLYGON';
  /**
   * Number of sides of the polygon. Must be an integer >= 3.
   */
  pointCount: number;
} & TDefaultShapeMixin &
  TFillsMixin;

export type TNode =
  | TFrameNode
  | TRectangleNode
  | TTextNode
  | TGroupNode
  | TEllipseNode
  | TStarNode
  | TPolygonNode
  | TSVGNode;

// ============================================================================
// Mixins
// ============================================================================

export type TDefaultShapeMixin = TBaseNodeMixin &
  TLayoutMixin &
  TBlendMixin &
  TEffectsMixin &
  TGeometryMixin &
  TSceneNodeMixin;

export type TRectangleCornerMixin = {
  /**
   * The number of pixels to round the top left corner of the node.
   */
  topLeftRadius: number;
  /**
   * The number of pixels to round the top right corner of the node.
   */
  topRightRadius: number;
  /**
   * The number of pixels to round the bottom left corner of the node.
   */
  bottomLeftRadius: number;
  /**
   * The number of pixels to round the bottom right corner of the node.
   */
  bottomRightRadius: number;
};

export type TBaseNodeMixin = {
  /**
   * An internal identifier for a node.
   *
   * e.g. '1798:14711'
   */
  id: string;
  /**
   * The name of the node.
   *
   * e.g. 'Cool Node'
   */
  name: string;
};

export type TChildrenMixin = {
  /**
   * The list of children, sorted back-to-front.
   * That is, the first child in the array is the bottommost layer in the scene,
   * and the last child in the array is the topmost layer.
   */
  children: Array<TNode>;
};

export type TLayoutMixin = {
  /**
   * The width of the node.
   */
  width: number;
  /**
   * The height of the node.
   */
  height: number;
  /**
   * The position of a node relative to its containing parent as a Transform matrix.
   * Not used for scaling, see width and height instead.
   */
  relativeTransform: TTransform;
};

export type TFillsMixin = {
  /**
   * The paints used to fill the area of the shape.
   */
  fills: Array<TPaint>;
};

export type TSceneNodeMixin = {
  /**
   * Whether the node is visible or not.
   */
  isVisible: boolean;
  /**
   * Whether the node is locked or not,
   * preventing certain user interactions on the canvas such as selecting and dragging.
   */
  isLocked: boolean;
};

export type TBlendMixin = {
  /**
   * Blend mode describes how a color blends with what's underneath it.
   */
  blendMode: TBlendMode;
  /**
   * The opacity of the node. Must be a value between 0 and 1. Defaults to 1.
   */
  opacity: number;
  /**
   * A boolean indicating if the node is used as a mask.
   * If true, the node masks the content underneath it.
   */
  isMask: boolean;
};

export type TEffectsMixin = {
  /**
   * An array of effects applied to the node.
   */
  effects: Array<TEffect>;
};

export type TGeometryMixin = {
  /**
   * An array of paths representing the object fills relative to the node.
   */
  fillGeometry: TVectorPath[];
  /**
   * An array of paths representing the object strokes relative to the node.
   */
  strokeGeometry: TVectorPath[];
};

// ============================================================================
// Effects
// ============================================================================

export type TDropShadowEffect = {
  type: 'DROP_SHADOW';
  color: TRGBA;
  offset: TVector;
  radius: number;
  spread?: number;
  visible: boolean;
  blendMode: TBlendMode;
  showShadowBehindNode?: boolean;
};

export type TInnerShadowEffect = {
  type: 'INNER_SHADOW';
  color: TRGBA;
  offset: TVector;
  radius: number;
  spread?: number;
  visible: boolean;
  blendMode: TBlendMode;
};

export type TBlurEffect = {
  type: 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  radius: number;
  visible: boolean;
};

export type TBlendMode =
  | 'PASS_THROUGH'
  | 'NORMAL'
  | 'DARKEN'
  | 'MULTIPLY'
  | 'LINEAR_BURN'
  | 'COLOR_BURN'
  | 'LIGHTEN'
  | 'SCREEN'
  | 'LINEAR_DODGE'
  | 'COLOR_DODGE'
  | 'OVERLAY'
  | 'SOFT_LIGHT'
  | 'HARD_LIGHT'
  | 'DIFFERENCE'
  | 'EXCLUSION'
  | 'HUE'
  | 'SATURATION'
  | 'COLOR'
  | 'LUMINOSITY';

export type TEffect = TDropShadowEffect | TInnerShadowEffect | TBlurEffect;

// ============================================================================
// Paints
// ============================================================================

export type TSolidPaint = {
  type: 'SOLID';
  color: TRGB;
  opacity: number;
  blendMode: TBlendMode;
};

export type TGradientPaint = TGradientPaintExported | TGradientPaintInline;

export type TGradientPaintBase = {
  visible: boolean;
  opacity: number;
  blendMode: TBlendMode;
};

export type TGradientPaintInline =
  | TLinearGradientPaintInline
  | TRadialGradientPaintInline
  | TAngularGradientPaintInline
  | TDiamondGradientPaintInline;

export type TLinearGradientPaintInline = {
  type: 'GRADIENT_LINEAR';
  isExported: false;
  start: TVector;
  end: TVector;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TRadialGradientPaintInline = {
  type: 'GRADIENT_RADIAL';
  isExported: false;
  radius: number;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TAngularGradientPaintInline = {
  type: 'GRADIENT_ANGULAR';
  isExported: false;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TDiamondGradientPaintInline = {
  type: 'GRADIENT_DIAMOND';
  isExported: false;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TGradientPaintExported = {
  type:
    | 'GRADIENT_LINEAR'
    | 'GRADIENT_RADIAL'
    | 'GRADIENT_ANGULAR'
    | 'GRADIENT_DIAMOND';
  isExported: true;
  format: 'JPG' | 'SVG';
  hash: string;
  inline?: Uint8Array;
} & TGradientPaintBase;

export type TImagePaint =
  | TImagePaintFill
  | TImagePaintFit
  | TImagePaintCrop
  | TImagePaintTile;

export type TImagePaintFill = {
  type: 'IMAGE';
  scaleMode: 'FILL';
  rotation: number;
} & TImagePaintMixin;

export type TImagePaintFit = {
  type: 'IMAGE';
  scaleMode: 'FIT';
  rotation: number;
} & TImagePaintMixin;

export type TImagePaintCrop = {
  type: 'IMAGE';
  scaleMode: 'CROP';
  transform: TTransform;
} & TImagePaintMixin;

export type TImagePaintTile = {
  type: 'IMAGE';
  scaleMode: 'TILE';
  rotation: number;
  scalingFactor: number;
} & TImagePaintMixin;

export type TImagePaintMixin = {
  hash: string;
  inline?: Uint8Array;
  filters?: TImageFilters;
  opacity: number;
  blendMode: TBlendMode;
  visible: boolean;
  width: number;
  height: number;
};

export type TImageFilters = {
  exposure?: number;
  contrast?: number;
  saturation?: number;
  temperature?: number;
  tint?: number;
  highlights?: number;
  shadows?: number;
};

export type TColorStop = {
  position: number;
  color: TRGBA;
};

export type TEmbedPaint = {
  type: 'EMBED';
  embedData: TEmbedMetaData;
};

export type TPaint = TSolidPaint | TGradientPaint | TImagePaint | TEmbedPaint;

// ============================================================================
// Base
// ============================================================================

export type TVector = {
  x: number;
  y: number;
};

export type TVectorPath = {
  /**
   * The winding rule for the path (same as in SVGs).
   * This determines whether a given point in space is inside or outside the path.
   */
  windingRule: WindingRule;
  /**
   * Data of the vector path.
   *
   * e.g. 'M 0 100 L 100 100 L 50 0 Z'
   */
  data: string;
};

type WindingRule = 'NONZERO' | 'EVENODD' | 'NONE';

export type TRGBA = {
  a: number;
} & TRGB;

export type TRGB = {
  r: number;
  g: number;
  b: number;
};

export type TTransform = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

// ============================================================================
// Font
// ============================================================================

export type TFontName = {
  family: string;
  style: string;
};

export type TLetterSpacing = {
  value: number;
  unit: 'PIXELS' | 'PERCENT';
};

export type TLineHeight =
  | {
      value: number;
      unit: 'PIXELS' | 'PERCENT';
    }
  | {
      unit: 'AUTO';
    };

// ============================================================================
// Other
// ============================================================================

export type TEllipseArcData = {
  startingAngle: number;
  endingAngle: number;
  /**
   * Ratio of the inner radius to the outer radius.
   */
  innerRadiusRatio: number;
};

export type TEmbedMetaData = {
  /**
   * The srcUrl of an embed is the URL that will be loaded in an iFrame
   * when the embed is activated.
   */
  srcUrl: string;
  /**
   * The canonicalUrl of an embed is the URL that will be navigated to
   * when the embed is opened in an external tab.
   */
  canonicalUrl: string;
  /**
   * The name of the provider of an embed.
   */
  title?: string;
  /**
   * The name of the provider of an embed.
   *
   * e.g. 'Spotify', 'YouTube'
   */
  provider?: string;
};

type TSVGElement = {
  /**
   * The name of the SVG element.
   *
   * e.g. 'rect', 'circle', 'text'
   */
  type: string;
  /**
   * Value of the SVG element, if it requires one.
   *
   * e.g. 'Jeff' for a 'text' SVG element
   */
  value?: string;
  /**
   * Attributes of the SVG element.
   *
   * e.g. For a 'circle' node something like 'cx', 'cy', 'r'
   */
  attributes: { [key: string]: string };
  /**
   * The list of children, sorted back-to-front.
   * That is, the first child in the array is the bottommost layer in the SVG,
   * and the last child in the array is the topmost layer.
   */
  children: TSVGElement[];
};
