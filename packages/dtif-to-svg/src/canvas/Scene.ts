import d3 from '@/d3';
import { appendAttributes, appendCSS } from '@/helpers/d3';
import { TScene } from '@pda/types/dtif';
import { shortId } from '@pda/utils';
import { appendNode } from './append-node';
import { D3Node, Node } from './nodes';

export class Scene {
  private readonly _nodes: Record<string, Node>;
  private readonly _selectedNodeIds: string[];
  private _root: Node | null;

  private _name: string;
  private _width: number;
  private _height: number;
  private _version: string;

  // D3
  private _d3Node: D3Node | null;

  constructor(scene: TScene) {
    this._version = scene.version;
    this._name = scene.name;
    this._width = scene.width;
    this._height = scene.height;
    this._selectedNodeIds = [];
    this._d3Node = null; // Set by init()
    this._root = null; // Set by init()

    this.init(scene);
  }

  private async init(scene: TScene) {
    // Create D3 node
    const svgNode = await Scene.createSvg(scene);

    // Create root element
    const root = await appendNode(svgNode.element, {
      node: scene.root,
      scene: this,
    });
    this._root = root;

    this._d3Node = svgNode;
  }

  // ============================================================================
  // Other
  // ============================================================================

  public ready(timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
      let elapsed = 0;
      const checkReady = () => {
        if (this._d3Node && this._root) {
          resolve(true);
        } else if (elapsed >= timeout) {
          // If timeout has elapsed and the scene is not ready yet, resolve with false
          resolve(false);
        } else {
          elapsed += 100;
          // If not ready, check again in 100ms
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  public addNode(node: Node) {
    this._nodes[node.id] = node;
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
