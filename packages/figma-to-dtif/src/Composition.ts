import { FailedToResolveRootNodeException } from '@/exceptions';
import {
  hasChildrenDTIF,
  hasChildrenFigma,
  hasFillsDTIF,
  hasFillsFigma,
  resetDTIFNodeTransform,
} from '@/helpers';
import { logger } from '@/logger';
import { transformNode, transformPaint } from '@/transform';
import { TTransformNodeOptions } from '@/types';
import { TComposition, TNode, TPaint } from '@pda/types/dtif';
import { extractErrorData, shortId } from '@pda/utils';

// 1. Go through node tree and extract to transform nodes (only traversing the ree plays a role here)
// 2. Go through to transform nodes and transform them while extracting to transform paints (children don't play any role here)
// 3. Go through to transform paints and transform them

export class Composition {
  // Nodes
  private _toTransformNodes: TToTransformNode[] = [];
  private _failedToTransformNodes: TToTransformNode[] = [];
  private readonly _toTransformRootNode: FrameNode;
  public readonly nodes: Record<string, TNode> = {};
  private _rootId: string;

  // Paints
  private _toTransformPaints: TToTransformPaint[] = [];
  private _failedToTransformPaints: TToTransformPaint[] = [];
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
    this._toTransformRootNode = node;
  }

  public static isSupportedNodeType(type: string) {
    return Composition.supportedNodeTypes.indexOf(type) !== -1;
  }

  public async transform(options: TTransformNodeOptions) {
    // Logging
    const startTime = new Date();
    logger.info(
      `Started transforming frame '${this._toTransformRootNode.name}' to composition!`,
      {
        node: this._toTransformRootNode,
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
    const rootId = this.lookupNodes();
    if (rootId != null) {
      this._rootId = rootId;
    } else {
      throw new FailedToResolveRootNodeException();
    }

    // Transform nodes
    await this.transformNodes(options);
    if (this._failedToTransformNodes.length > 0) {
      logger.error(
        `One or more nodes failed the transformation to DTIF node. Failed nodes: ${this._failedToTransformNodes
          .map(
            (toTransformNode) =>
              `[${toTransformNode.id} -> ${toTransformNode.node.name}]`
          )
          .join(', ')}`,
        {
          failedNodes: [...this._failedToTransformNodes],
        }
      );
    }

    // Transform paints
    await this.transformPaints(options);
    if (this._failedToTransformPaints.length > 0) {
      logger.error(
        `One or more fill paints failed the transformation to DTIF paint. Failed fill paints: ${this._failedToTransformNodes
          .map((toTransformPaint) => toTransformPaint.id)
          .join(', ')}`,
        {
          failedPaints: [...this._failedToTransformPaints],
        }
      );
    }

    // Reset root node layout properties (e.g. x, y, rotation)
    // as its now in a different context as it was in Figma scene
    if (this.root != null) {
      resetDTIFNodeTransform(this.root);
    } else {
      throw new FailedToResolveRootNodeException();
    }

    // Construct composition
    const compositionObject: TComposition = {
      version: '1.0',
      name: this._toTransformRootNode.name,
      width: this._toTransformRootNode.width,
      height: this._toTransformRootNode.height,
      nodes: this.nodes,
      paints: this.paints,
      root: this._rootId,
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
        this._toTransformRootNode.name
      }' to composition in ${(timeElapsedInMs / 1000).toFixed(2)}s!`,
      { composition: compositionObject }
    );

    return compositionObject;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public get root() {
    return this.getNode(this._rootId);
  }

  public getNode(id: string): TNode | null {
    return id in this.nodes ? this.nodes[id] : null;
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public async transformNodes(options: TTransformNodeOptions) {
    const toTransformNodes = this._toTransformNodes.concat(
      this._failedToTransformNodes
    );
    this._failedToTransformNodes = [];
    this._toTransformNodes = [];

    // Transform nodes
    for (const toTransformNode of toTransformNodes) {
      try {
        const node = await transformNode(toTransformNode.node, options);
        this.nodes[toTransformNode.id] = node;
        if (hasChildrenDTIF(node)) {
          node.children = toTransformNode.childrenIds;
        }
        if (hasFillsDTIF(node)) {
          node.fills = toTransformNode.paintIds;
        }
      } catch (error) {
        const errorData = extractErrorData(error);
        logger.error(
          `Failed to transform node '${toTransformNode.node.name}' by error: ${errorData.message}`
        );
        this._failedToTransformNodes.push(toTransformNode);
      }
    }
  }

  public async transformPaints(options: TTransformNodeOptions) {
    const toTransformPaints = this._toTransformPaints.concat(
      this._failedToTransformPaints
    );
    this._failedToTransformPaints = [];
    this._toTransformPaints = [];

    // Transform nodes
    for (const toTransformPaint of toTransformPaints) {
      try {
        const paint = await transformPaint(
          toTransformPaint.paint,
          toTransformPaint.node,
          options
        );
        this.paints[toTransformPaint.id] = paint;
      } catch (error) {
        const errorData = extractErrorData(error);
        logger.error(
          `Failed to transform paint '${toTransformPaint.id}' by error: ${errorData.message}`
        );
        this._failedToTransformPaints.push(toTransformPaint);
      }
    }
  }

  public lookupNodes(): string | null {
    let paintCount = 0;
    let nodeCount = 0;
    let rootId: string | null = null;

    this._toTransformNodes = [];
    this._toTransformPaints = [];

    const walk = (node: SceneNode, isRoot = false) => {
      const childrenIds: string[] = [];
      const paintIds: string[] = [];
      const nodeId = `${shortId()}-${nodeCount++}`;
      if (isRoot) {
        rootId = nodeId;
      }

      // Discover children
      if (hasChildrenFigma(node)) {
        node.children.forEach((child) => {
          const childId = walk(child);
          childrenIds.push(childId);
        });
      }

      // Discover fill paints
      if (hasFillsFigma(node) && Array.isArray(node.fills)) {
        node.fills.forEach((paint) => {
          const paintId = `${shortId()}-${paintCount++}`;
          this._toTransformPaints.push({ id: paintId, paint, node });
          paintIds.push(paintId);
        });
      }

      this._toTransformNodes.push({
        id: nodeId,
        node,
        childrenIds,
        paintIds,
      });

      return nodeId;
    };

    walk(this._toTransformRootNode, true);

    return rootId;
  }

  private createExportContainerNode(name: string) {
    const node = figma.createFrame();
    node.name = name;
    node.resize(1, 1);
    node.clipsContent = false; // With clip content active figma would just export the visible piece in the frame
    return node;
  }
}

type TToTransformNode = {
  id: string;
  node: SceneNode;
  childrenIds: string[];
  paintIds: string[];
};

type TToTransformPaint = {
  id: string;
  node: SceneNode;
  paint: Paint;
};
