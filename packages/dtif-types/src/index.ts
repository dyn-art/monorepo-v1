export enum ESupportedFigmaNodeTypes {
  FRAME = 'FRAME',
  COMPONENT = 'COMPONENT',
  INSTANCE = 'INSTANCE',
  GROUP = 'GROUP',
  TEXT = 'TEXT',
  RECTANGLE = 'RECTANGLE',
  LINE = 'LINE',
  ELLIPSE = 'ELLIPSE',
  POLYGON = 'POLYGON',
  STAR = 'STAR',
  VECTOR = 'VECTOR',
  'BOOLEAN_OPERATION' = 'BOOLEAN_OPERATION',
}

export enum ENodeTypes {
  FRAME = 'FRAME',
  GROUP = 'GROUP',
  TEXT = 'TEXT',
  RECTANGLE = 'RECTANGLE',
  SVG = 'SVG',
}

// ============================================================================
// Scene
// ============================================================================

export type TScene = {
  version: '1.0';
  name: string;
  width: number;
  height: number;
  root: TFrameNode;
};

// ============================================================================
// Nodes
// ============================================================================

export type TFrameNode = {
  type: ENodeTypes.FRAME;
  clipsContent: boolean;
} & TBaseNodeMixin &
  TSceneNodeMixin &
  TChildrenMixin &
  TLayoutMixin &
  TBlendMixin &
  TRectangleCornerMixin &
  TFillsMixin;

export type TRectangleNode = {
  type: ENodeTypes.RECTANGLE;
} & TDefaultShapeMixin &
  TRectangleCornerMixin &
  TFillsMixin;

export type TSVGNode = TSVGNodeExported | TSVGNodeInline;

export type TSVGNodeExported = {
  type: ENodeTypes.SVG;
  format: 'JPG' | 'SVG';
  hash: string;
  inline?: Uint8Array;
} & TDefaultShapeMixin;

export type TSVGNodeInline = {
  type: ENodeTypes.SVG;
  attributes: Record<string, string>;
  children: { type: string; attributes: Record<string, string> };
} & TDefaultShapeMixin;

export type TTextNode = {
  type: ENodeTypes.TEXT;
  textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
  fontSize: number;
  fontName: TFontName;
  fontWeight: number;
  letterSpacing: TLetterSpacing;
  lineHeight: TLineHeight;
  characters: string;
} & TDefaultShapeMixin &
  TFillsMixin;

export type TGroupNode = {
  type: ENodeTypes.GROUP;
} & TBaseNodeMixin &
  TSceneNodeMixin &
  TChildrenMixin &
  TBlendMixin &
  TLayoutMixin;

export type TNode =
  | TFrameNode
  | TRectangleNode
  | TTextNode
  | TGroupNode
  | TSVGNode;

// ============================================================================
// Mixins
// ============================================================================

export type TDefaultShapeMixin = TBaseNodeMixin &
  TLayoutMixin &
  TBlendMixin &
  TSceneNodeMixin;

export type TRectangleCornerMixin = {
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
};

export type TBaseNodeMixin = {
  id: string; // e.g. "1798:14711"
  name: string; // e.g. "Spotify Classic | Gradient"
};

export type TChildrenMixin = {
  children: Array<TNode>;
};

export type TLayoutMixin = {
  width: number;
  height: number;
  relativeTransform: TTransform;
};

export type TFillsMixin = {
  fills: Array<TPaint>;
};

export type TSceneNodeMixin = {
  isVisible: boolean;
  isLocked: boolean;
};

// ============================================================================
// Effects
// ============================================================================

export type TBlendMixin = {
  blendMode: TBlendMode;
  opacity: number;
  isMask: boolean;
  effects: Array<TEffect>;
};

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
  exported: false;
  start: TVector;
  end: TVector;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TRadialGradientPaintInline = {
  type: 'GRADIENT_RADIAL';
  exported: false;
  radius: number;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TAngularGradientPaintInline = {
  type: 'GRADIENT_ANGULAR';
  exported: false;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TDiamondGradientPaintInline = {
  type: 'GRADIENT_DIAMOND';
  exported: false;
  transform: TTransform;
  gradientStops: Array<TColorStop>;
} & TGradientPaintBase;

export type TGradientPaintExported = {
  type:
    | 'GRADIENT_LINEAR'
    | 'GRADIENT_RADIAL'
    | 'GRADIENT_ANGULAR'
    | 'GRADIENT_DIAMOND';
  exported: true;
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

export type TPaint = TSolidPaint | TGradientPaint | TImagePaint;

// ============================================================================
// Base
// ============================================================================

export type TVector = {
  x: number;
  y: number;
};

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
