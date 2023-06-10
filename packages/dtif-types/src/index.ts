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
// Nodes
// ============================================================================

export type TFrameNode = {
  readonly type: ENodeTypes.FRAME;
  readonly clipsContent: boolean;
} & TBaseNodeMixin &
  TChildrenMixin &
  TLayoutMixin &
  TBlendMixin &
  TRectangleCornerMixin &
  TFillsMixin;

export type TRectangleNode = {
  readonly type: ENodeTypes.RECTANGLE;
} & TDefaultShapeMixin &
  TRectangleCornerMixin &
  TFillsMixin;

export type TSVGNode = {
  readonly type: ENodeTypes.SVG;
  readonly svgHash: string;
} & TDefaultShapeMixin;

export type TTextNode = {
  readonly type: ENodeTypes.TEXT;
  readonly textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  readonly textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
  readonly fontSize: number;
  readonly fontName: TFontName;
  readonly fontWeight: number;
  letterSpacing: TLetterSpacing;
  lineHeight: TLineHeight;
  characters: string;
} & TDefaultShapeMixin &
  TFillsMixin;

export type TGroupNode = {
  readonly type: ENodeTypes.GROUP;
} & TBaseNodeMixin &
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

export type TDefaultShapeMixin = TBaseNodeMixin & TLayoutMixin & TBlendMixin;

export type TRectangleCornerMixin = {
  readonly topLeftRadius: number;
  readonly topRightRadius: number;
  readonly bottomLeftRadius: number;
  readonly bottomRightRadius: number;
};

export type TBaseNodeMixin = {
  readonly id: string;
  readonly name: string;
};

export type TChildrenMixin = {
  readonly children: ReadonlyArray<TNode>;
};

export type TLayoutMixin = {
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly transform: TTransform;
} & TVector;

export type TFillsMixin = {
  readonly fills: ReadonlyArray<TPaint>;
};

// ============================================================================
// Effects
// ============================================================================

export type TBlendMixin = {
  readonly blendMode: TBlendMode;
  readonly opacity: number;
  readonly isMask: boolean;
  readonly effects: ReadonlyArray<TEffect>;
};

export type TDropShadowEffect = {
  readonly type: 'DROP_SHADOW';
  readonly color: TRGBA;
  readonly offset: TVector;
  readonly radius: number;
  readonly spread?: number;
  readonly visible: boolean;
  readonly blendMode: TBlendMode;
  readonly showShadowBehindNode?: boolean;
};

export type TInnerShadowEffect = {
  readonly type: 'INNER_SHADOW';
  readonly color: TRGBA;
  readonly offset: TVector;
  readonly radius: number;
  readonly spread?: number;
  readonly visible: boolean;
  readonly blendMode: TBlendMode;
};

export type TBlurEffect = {
  readonly type: 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  readonly radius: number;
  readonly visible: boolean;
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
  readonly type: 'SOLID';
  readonly color: TRGB;
  readonly opacity?: number;
  readonly blendMode?: TBlendMode;
};

export type TGradientPaint = {
  readonly type:
    | 'GRADIENT_LINEAR'
    | 'GRADIENT_RADIAL'
    | 'GRADIENT_ANGULAR'
    | 'GRADIENT_DIAMOND';
  readonly gradientTransform: TTransform;
  readonly gradientStops: ReadonlyArray<TColorStop>;
  readonly visible?: boolean;
  readonly opacity?: number;
  readonly blendMode?: TBlendMode;
  readonly svgHash?: string;
};

export type TImagePaint = {
  readonly type: 'IMAGE';
  readonly scaleMode: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  readonly imageHash: string | null;
  readonly imageTransform?: TTransform;
  readonly scalingFactor?: number;
  readonly rotation?: number;
  readonly filters?: TImageFilters;
  readonly visible?: boolean;
  readonly opacity?: number;
  readonly blendMode?: TBlendMode;
};

export type TImageFilters = {
  readonly exposure?: number;
  readonly contrast?: number;
  readonly saturation?: number;
  readonly temperature?: number;
  readonly tint?: number;
  readonly highlights?: number;
  readonly shadows?: number;
};

export type TColorStop = {
  readonly position: number;
  readonly color: TRGBA;
};

export type TPaint = TSolidPaint | TGradientPaint | TImagePaint;

// ============================================================================
// Base
// ============================================================================

export type TVector = {
  readonly x: number;
  readonly y: number;
};

export type TRGBA = {
  readonly a: number;
} & TRGB;

export type TRGB = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

export type TTransform = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

export type TFontName = {
  readonly family: string;
  readonly style: string;
};

export type TLetterSpacing = {
  readonly value: number;
  readonly unit: 'PIXELS' | 'PERCENT';
};

export type TLineHeight =
  | {
      readonly value: number;
      readonly unit: 'PIXELS' | 'PERCENT';
    }
  | {
      readonly unit: 'AUTO';
    };
