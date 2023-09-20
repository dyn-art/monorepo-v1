import { d3 } from '@/d3';
import { appendAttributes, appendCSS } from '@/helpers';
import { TComposition } from '@dyn/types/dtif';
import { shortId } from '@dyn/utils';
import { TD3Selection } from '../types';
import { RemoveFunctions, Watcher } from './Watcher';
import { appendNode } from './append';
import { FontManager, TextSegmenter } from './font';
import { CompositionNode, D3Node } from './nodes';

export class Composition {
  private readonly _name: string;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _version: string;

  protected readonly _nodes: Record<string, CompositionNode> = {};
  protected _rootNodeId: string | null = null;

  public readonly fontManager: FontManager;

  protected readonly _watcher: Watcher<TWatchedScene>;

  // D3
  protected _d3Node: D3Node | null = null;

  // Init
  private _forInit: {
    dtifComposition: TComposition;
  } | null;

  constructor(
    dtifComposition: TComposition,
    options: TCompositionOptions = {}
  ) {
    const textSegmenter = options.text?.textSegmenter;
    const { text: { fontManager = new FontManager({ textSegmenter }) } = {} } =
      options;
    this._forInit = { dtifComposition };
    this._version = dtifComposition.version;
    this._name = dtifComposition.name;
    this._width = dtifComposition.width;
    this._height = dtifComposition.height;
    this._watcher = new Watcher();
    this.fontManager = fontManager;
  }

  public async init() {
    if (this._forInit == null) {
      return this;
    }
    const { dtifComposition } = this._forInit;

    // Resolve typefaces
    for (const typefaceId in dtifComposition.typefaces) {
      const typeface = dtifComposition.typefaces[typefaceId];
      await this.fontManager.loadTypeface({ ...typeface, id: typefaceId });
    }

    // Create D3 node
    const svgNode = await Composition.createSvg(dtifComposition);

    // Create root element
    const rootId = dtifComposition.rootId;
    const root = await appendNode(svgNode, {
      id: rootId,
      node: dtifComposition.nodes[rootId],
      composition: this,
      dtifComposition: dtifComposition,
    });
    if (root != null) {
      this.addNode(root);
      this._rootNodeId = root.id;
    }

    this._d3Node = svgNode;
    this._forInit = null;
    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public getWatcher() {
    return this._watcher;
  }

  public get root(): CompositionNode | null {
    return this.getNode(this._rootNodeId);
  }

  public addNode(node: CompositionNode) {
    this._nodes[node.id] = node;
  }

  public getNode(id: string | null | undefined): CompositionNode | null {
    return id != null && id in this._nodes ? this._nodes[id] : null;
  }

  // ============================================================================
  // Other
  // ============================================================================

  public toSVG(): string | null {
    const domNode: any = this.toDOMNode();
    return domNode?.outerHTML ?? null;
  }

  public toDOMNode(): SVGElement | null {
    return this._d3Node?.element.node() ?? null;
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createSvg(scene: TComposition) {
    // Create svg element
    const svgElement = (await d3()).create(
      'svg'
    ) as unknown as TD3Selection<SVGElement>;
    appendAttributes(svgElement, {
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      width: scene.width,
      height: scene.height,
      fill: 'none',
      viewBox: [0, 0, scene.width, scene.height],
    });
    appendCSS(svgElement, {
      printColorAdjust: 'exact',
    });

    // Create svg node
    const svgNode = new D3Node('svg', svgElement, {
      id: shortId(),
      children: null,
    });

    // Append description element
    const descNode = svgNode.append('desc');
    descNode?.element.text(scene.name);

    return svgNode;
  }
}

type TWatchedScene = RemoveFunctions<Composition>;

export type TCompositionOptions = {
  text?: {
    fontManager?: FontManager;
    textSegmenter?: TextSegmenter;
  };
};
