import { TTextNode } from '@pda/types/dtif';
import { Composition } from '../Composition';
import { RemoveFunctions, Watcher } from '../Watcher';
import { CompositionNode, D3Node, ShapeNode } from './base';

export class Text extends ShapeNode {
  private _textAlignHorizontal: TTextNode['textAlignHorizontal'];
  private _textAlignVertical: TTextNode['textAlignVertical'];
  private _fontSize: TTextNode['fontSize'];
  private _font: TTextNode['font'];
  private _letterSpacing: TTextNode['letterSpacing'];
  private _lineHeight: TTextNode['lineHeight'];
  private _characters: TTextNode['characters'];

  // D3 ids
  private readonly _d3RootNodeId: string;

  protected readonly _watcher: Watcher<TWatchedTextNode>;

  // Init
  private _forInit: {
    node: TTextNode;
  } | null;

  constructor(node: TTextNode, composition: Composition) {
    super(node, composition, { type: 'text' });
    this._forInit = {
      node,
    };

    this._textAlignHorizontal = node.textAlignHorizontal;
    this._textAlignVertical = node.textAlignVertical;
    this._fontSize = node.fontSize;
    this._font = node.font;
    this._letterSpacing = node.letterSpacing;
    this._lineHeight = node.lineHeight;
    this._characters = node.characters;

    // Define D3 node ids
    this._d3RootNodeId = this.getD3NodeId();
  }

  public async init(parent: D3Node) {
    if (this._forInit == null) {
      return this;
    }
    const { node } = this._forInit;

    // Create D3 node
    this._d3Node = await Text.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
      },
    });

    this._forInit = null;
    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public getWatcher() {
    return this._watcher;
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
      };
    }
  ) {
    const {
      ids: { rootNodeId },
      node,
    } = props;

    // Create root element
    const root = await CompositionNode.createWrapperD3Node(parent, {
      id: rootNodeId,
      node: props.node,
    });

    // TODO:

    return root;
  }
}

type TWatchedTextNode = RemoveFunctions<Text>;
