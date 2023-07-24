import d3 from '@/d3';
import { appendAttributes, appendCSS } from '@/helpers/d3';
import { TComposition } from '@pda/types/dtif';
import { shortId } from '@pda/utils';
import { RemoveFunctions, Watcher } from './Watcher';
import { appendNode } from './append';
import { CompositionNode, D3Node } from './nodes';

export class Composition {
  protected readonly _nodes: Record<string, CompositionNode>;
  protected _rootNodeId: string | null;

  private readonly _name: string;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _version: string;

  protected readonly _watcher: Watcher<TWatchedScene>;

  // D3
  protected _d3Node: D3Node | null;

  // Init
  private _forInit: {
    scene: TComposition;
  } | null;

  constructor(composition: TComposition) {
    this._forInit = { scene: composition };
    this._version = composition.version;
    this._name = composition.name;
    this._width = composition.width;
    this._height = composition.height;
    this._nodes = {};
    this._d3Node = null; // Set by init()
    this._rootNodeId = null; // Set by init()
    this._watcher = new Watcher();
  }

  public async init() {
    if (this._forInit == null) {
      return this;
    }
    const { scene } = this._forInit;

    // Create D3 node
    const svgNode = await Composition.createSvg(scene);

    // Create root element
    const root = await appendNode(svgNode, {
      node: scene.root,
      scene: this,
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
    const svgElement = (await d3()).create('svg');
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
