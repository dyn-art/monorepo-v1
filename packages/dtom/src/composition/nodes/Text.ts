import { TComposition, TTextNode } from '@pda/types/dtif';
import { Composition } from '../Composition';
import { RemoveFunctions, Watcher } from '../Watcher';
import { Fill } from '../fill';
import { Space, Typeface } from '../font';
import { CompositionNode, D3Node, ShapeNode } from './base';

// TODO:
// 1. Load typefaces in Composition (FontManager)
// 2. Text get typeface by id in constructor (fallback on default if not found)

export class Text extends ShapeNode {
  private _textAlignHorizontal: TTextNode['textAlignHorizontal'];
  private _textAlignVertical: TTextNode['textAlignVertical'];
  private _fontSize: TTextNode['fontSize'];
  private _letterSpacing: TTextNode['letterSpacing'];
  private _lineHeight: TTextNode['lineHeight'];
  private _characters: TTextNode['characters'];
  private _typeface: Typeface | null;

  private _tabSize = 8;
  private _tabWidth: number;
  private _absoluteLetterSpacing: number | null;
  private _absoluteLineHeight: number | null;

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3FillClipPathId: string;
  private readonly _d3FillClipPathDefsNodeId: string;
  private readonly _d3FillClippedShapeNodeId: string;
  private readonly _d3FillNodeId: string;

  protected readonly _watcher: Watcher<TWatchedTextNode>;

  // Init
  private _forInit: {
    node: TTextNode;
  } | null;

  constructor(id: string, node: TTextNode, composition: Composition) {
    super(id, node, composition, { type: 'text' });
    this._typeface =
      node.typefaceId != null
        ? composition.fontManager.getTypefaceById(node.typefaceId)
        : null;
    this._forInit = {
      node,
    };

    this._textAlignHorizontal = node.textAlignHorizontal;
    this._textAlignVertical = node.textAlignVertical;
    this._fontSize = node.fontSize;
    this._letterSpacing = node.letterSpacing;
    this._lineHeight = node.lineHeight;
    this._characters = node.characters;

    this._absoluteLetterSpacing = this.getAbsoluteLetterSpacing(
      node.letterSpacing
    );
    this._absoluteLineHeight = this.getAbsoluteLineHeight(node.lineHeight);

    // Define D3 node ids
    this._d3RootNodeId = this.getD3NodeId();
  }

  public async init(parent: D3Node, dtifComposition: TComposition) {
    if (this._forInit == null) {
      return this;
    }
    const { node } = this._forInit;

    if (node.typefaceId != null) {
      // Get typeface (was loaded during Composition initialization)
      const typeface = this.composition.fontManager.getTypefaceById(
        node.typefaceId
      );
      if (typeface != null) {
        this._typeface = typeface;
        const letterSpacing =
          this._absoluteLetterSpacing ??
          this.getAbsoluteLetterSpacing(node.letterSpacing); // Recalculate if AUTO

        // Calculate tab width
        const spaceWidth =
          typeface.measureGrapheme(Space, {
            fontSize: this._fontSize,
            letterSpacing,
          }) ?? this._fontSize;
        this._tabWidth = spaceWidth * this._tabSize;
      }
    }

    // Create D3 node
    this._d3Node = await Text.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        fillClipPathId: this._d3FillClipPathId,
        fillClipPathDefsNodeId: this._d3FillClipPathDefsNodeId,
        fillClippedShapeNodeId: this._d3FillClippedShapeNodeId,
        fillNodeId: this._d3FillNodeId,
      },
    });

    // Retrieve fill wrapper node
    const fillWrapperNode = this._d3Node?.getChildNodeById(this._d3FillNodeId);
    if (fillWrapperNode == null) {
      return this;
    }
    // and append fill paints
    this._fill.init(fillWrapperNode, dtifComposition);

    this._forInit = null;
    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public getWatcher() {
    return this._watcher;
  }

  public get characters() {
    return this._characters;
  }

  public getAbsoluteLetterSpacing(
    letterSpacing: TTextNode['letterSpacing']
  ): number {
    switch (letterSpacing.unit) {
      case 'PIXELS':
        return letterSpacing.value;
      case 'PERCENT':
        return this._fontSize * (letterSpacing.value / 100);
      case 'AUTO':
        // TODO:
        return 0;
    }
  }

  public getAbsoluteLineHeight(lineHeight: TTextNode['lineHeight']): number {
    switch (lineHeight.unit) {
      case 'PIXELS':
        return lineHeight.value;
      case 'PERCENT':
        return this._fontSize * (lineHeight.value / 100);
      case 'AUTO':
        // TODO:
        return 0;
    }
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: D3Node,
    props: {
      node: TTextNode;
      ids: {
        rootNodeId: string;
        fillClipPathId: string;
        fillClipPathDefsNodeId: string;
        fillClippedShapeNodeId: string;
        fillNodeId: string;
      };
    }
  ) {
    const {
      ids: {
        rootNodeId,
        fillClipPathId,
        fillClipPathDefsNodeId,
        fillClippedShapeNodeId,
        fillNodeId,
      },
      node,
    } = props;

    // Create root element
    const root = await CompositionNode.createWrapperD3Node(parent, {
      id: rootNodeId,
      node,
    });

    // Create fill clip path element
    const fillClipPathDefsNode = root.append('defs', {
      id: fillClipPathDefsNodeId,
    });
    const fillClipPathNode = fillClipPathDefsNode.append('clipPath', {
      id: fillClipPathId,
    });
    fillClipPathNode.append('path', {
      id: fillClippedShapeNodeId,
      attributes: {
        p: '', // TODO: create text path
      },
    });

    // Create fill wrapper element
    await Fill.createFillWrapperD3Node(root, {
      id: fillNodeId,
      clipPathId: fillClipPathId,
    });

    return root;
  }
}

type TWatchedTextNode = RemoveFunctions<Text>;
