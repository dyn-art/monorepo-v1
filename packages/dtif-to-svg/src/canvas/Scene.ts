import d3 from '@/d3';
import { appendAttributes, appendCSS } from '@/helpers/d3';
import { TScene } from '@pda/types/dtif';
import { shortId } from '@pda/utils';
import { appendNode } from './append-node';
import { D3Node, Node } from './nodes';

export class Scene {
  private readonly _nodes: Record<string, Node>;
  private readonly _selectedNodeIds: string[];
  private _rootNodeId: string | null;

  private _name: string;
  private _width: number;
  private _height: number;
  private _version: string;

  // D3
  private _d3Node: D3Node | null;

  // Init
  private _forInit: {
    scene: TScene;
  } | null;

  constructor(scene: TScene) {
    this._forInit = { scene };
    this._version = scene.version;
    this._name = scene.name;
    this._width = scene.width;
    this._height = scene.height;
    this._selectedNodeIds = [];
    this._nodes = {};
    this._d3Node = null; // Set by init()
    this._rootNodeId = null; // Set by init()
  }

  public async init() {
    if (this._forInit == null) {
      return this;
    }
    const { scene } = this._forInit;

    // Create D3 node
    const svgNode = await Scene.createSvg(scene);

    // Create root element
    const root = await appendNode(svgNode.element, {
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
  // Other
  // ============================================================================

  public addNode(node: Node) {
    this._nodes[node.id] = node;
  }

  public toSVG(): string | null {
    const domNode: any = this._d3Node?.element.node();
    return domNode?.outerHTML ?? null;
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createSvg(scene: TScene) {
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
