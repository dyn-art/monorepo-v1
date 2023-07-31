import { hasChildren, hasFill } from '@/helpers';
import { logger } from '@/logger';
import { TTransformNodeOptions } from '@/types';
import { TComposition, TNode, TPaint } from '@pda/types/dtif';
import { shortId } from '@pda/utils';

// 1. Go through node tree and extract to transform nodes (only traversing the ree plays a role here)
// 2. Go through to transform nodes and transform them while extracting to transform paints (children don't play any role here)
// 3. Go through to transform paints and transform them

export class Composition {
  // Nodes
  private _toTransformNodes: TToTransformNodes[] = [];
  public readonly nodes: Record<string, TNode> = {};
  public readonly rootNode: FrameNode;

  // Paints
  private _toTransformPaints: TToTransformPaint[] = [];
  public readonly paints: Record<string, TPaint> = {};

  public static readonly supportedNodeTypes = [
    'FRAME',
    'COMPONENT',
    'INSTANCE',
    'GROUP',
    'TEXT',
    'RECTANGLE',
    'LINE',
    'ELLIPSE',
    'POLYGON',
    'STAR',
    'VECTOR',
    'BOOLEAN_OPERATION',
  ];

  constructor(node: FrameNode) {
    this.rootNode = node;
  }

  public static isSupportedNodeType(type: string) {
    return Composition.supportedNodeTypes.indexOf(type) !== -1;
  }

  public async transform(options: TTransformNodeOptions) {
    // Logging
    const startTime = new Date();
    logger.info(
      `Started transforming frame '${this.rootNode.name}' to composition!`,
      {
        node: this.rootNode,
      }
    );

    // Create temporary container node to contain nodes that need to be cloned during export temporarily (e.g. SVG).
    // It servers for the user as context so that no non user created nodes are randomly flying around.
    const exportContainerNode =
      options.exportContainerNode ??
      this.createExportContainerNode(
        'Temporary container for exporting | Delete if dyn.art plugin not active!'
      );

    // Lookup nodes to be transformed
    this.lookupNodes();

    // Transform nodes
    // TODO: after transform also add paintIds and childrenIds as I've decided to leave it out of transform stuff

    // Transform fills
    // TODO:

    // Construct composition
    const compositionObject: TComposition = {
      version: '1.0',
      name: '',
      width: 0,
      height: 0,
      nodes: this.nodes,
      paints: this.paints,
      root: '',
    };

    // Remove temporary export container
    if (options.exportContainerNode != null) {
      exportContainerNode.remove();
    }

    // Logging
    const endTime = new Date();
    const timeElapsedInMs = endTime.getTime() - startTime.getTime();
    logger.success(
      `Successfully transformed frame '${
        this.rootNode.name
      }' to composition in ${Math.round(timeElapsedInMs / 1000)}s!`,
      { composition: compositionObject }
    );

    return compositionObject;
  }

  public lookupNodes() {
    let paintCount = 0;
    let nodeCount = 0;

    this._toTransformNodes = [];
    this._toTransformPaints = [];

    const walk = (node: SceneNode) => {
      const childrenIds: string[] = [];
      const paintIds: string[] = [];
      const id = `${shortId()}-${nodeCount++}`;

      // Discover children
      if (hasChildren(node)) {
        node.children.forEach((child) => {
          const childId = walk(child);
          childrenIds.push(childId);
        });
      }

      // Discover fill paints
      if (hasFill(node) && Array.isArray(node.fills)) {
        node.fills.forEach((paint) => {
          const id = `${shortId()}-${paintCount++}`;
          this._toTransformPaints.push({ id, paint });
        });
      }

      this._toTransformNodes.push({
        id,
        node,
        childrenIds,
        paintIds,
      });

      return id;
    };

    walk(this.rootNode);
  }

  private createExportContainerNode(name: string) {
    const node = figma.createFrame();
    node.name = name;
    node.resize(1, 1);
    node.clipsContent = false; // With clip content active figma would just export the visible piece in the frame
    return node;
  }
}

type TToTransformNodes = {
  id: string;
  node: SceneNode;
  childrenIds: string[];
  paintIds: string[];
};

type TToTransformPaint = {
  id: string;
  paint: Paint;
};
