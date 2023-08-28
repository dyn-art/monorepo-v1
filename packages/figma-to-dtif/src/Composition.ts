import { FailedToResolveRootNodeException } from '@/exceptions';
import {
  excludeMixed,
  h64,
  hasChildrenDTIF,
  hasChildrenFigma,
  hasFillDTIF,
  hasFillFigma,
  isTextNode,
  resetDTIFNodeTransform,
} from '@/helpers';
import { logger } from '@/logger';
import { transformNode, transformPaint, transformTypeface } from '@/transform';
import {
  TTransformNodeOptions,
  TTypeFaceWithoutContent as TTypefaceWithoutContent,
} from '@/types';
import { TComposition, TNode, TPaint, TTypeface } from '@dyn/types/dtif';
import { extractErrorData, shortId } from '@dyn/utils';

export class Composition {
  // Nodes
  private _toTransformNodes: TToTransformNode[] = [];
  private _failedToTransformNodes: TToTransformNode[] = [];
  private readonly _toTransformRootNode: FrameNode;
  public readonly nodes: Record<string, TNode> = {};
  private _rootId: string;

  // Paints
  private _toTransformPaints: Map<string, Omit<TToTransformPaint, 'id'>> =
    new Map();
  private _failedToTransformPaints: TToTransformPaint[] = [];
  public readonly paints: Record<string, TPaint> = {};

  // Fonts
  private _toTransformTypefaces: Map<string, Omit<TToTransformTypeface, 'id'>> =
    new Map();
  private _failedToTransformTypefaces: TToTransformTypeface[] = [];
  public readonly typefaces: Record<string, TTypeface> = {};

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
        `One or more fill paints failed the transformation to DTIF paint. Failed fill paints: ${this._failedToTransformPaints
          .map((toTransformPaint) => toTransformPaint.id)
          .join(', ')}`,
        {
          failedPaints: [...this._failedToTransformPaints],
        }
      );
    }

    // Transform typefaces
    await this.transformTypefaces(options);
    if (this._failedToTransformTypefaces.length > 0) {
      logger.error(
        `One or more typefaces failed the transformation and export to DTIF typefaces. Failed typefaces: ${this._failedToTransformTypefaces
          .map((toTransformTypeface) => toTransformTypeface.id)
          .join(', ')}`,
        {
          failedPaints: [...this._failedToTransformTypefaces],
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
      typefaces: this.typefaces,
      rootId: this._rootId,
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
          node.childIds = toTransformNode.childrenIds;
        }
        if (hasFillDTIF(node)) {
          node.fill = { paintIds: toTransformNode.paintIds };
        }
        if (isTextNode(node)) {
          node.typefaceId = toTransformNode.typefaceId ?? undefined;
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
    const toTransformPaints = Array.from(
      this._toTransformPaints,
      ([key, value]) => ({ id: key, ...value })
    ).concat(this._failedToTransformPaints);
    this._failedToTransformPaints = [];
    this._toTransformPaints = new Map();

    // Transform paints
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

  public async transformTypefaces(options: TTransformNodeOptions) {
    const toTransformTypefaces = Array.from(
      this._toTransformTypefaces,
      ([key, value]) => ({ id: key, ...value })
    ).concat(this._failedToTransformTypefaces);
    this._failedToTransformTypefaces = [];
    this._toTransformTypefaces = new Map();

    // Transform typefaces
    for (const toTransformTypeface of toTransformTypefaces) {
      try {
        const typeface = await transformTypeface(
          toTransformTypeface.typeface,
          toTransformTypeface.node,
          options
        );
        this.typefaces[toTransformTypeface.id] = typeface;
      } catch (error) {
        const errorData = extractErrorData(error);
        logger.error(
          `Failed to transform typeface '${toTransformTypeface.id}' by error: ${errorData.message}`
        );
        this._failedToTransformTypefaces.push(toTransformTypeface);
      }
    }
  }

  public lookupNodes(): string | null {
    let nodeCount = 0;
    let rootId: string | null = null;

    this._toTransformNodes = [];
    this._toTransformPaints = new Map();

    const walk = (node: SceneNode, isRoot = false) => {
      const childrenIds: string[] = [];
      const paintIds: string[] = [];
      let typefaceId: string | null = null;
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
      if (hasFillFigma(node)) {
        const fills = excludeMixed(node, 'fills');
        fills.forEach((paint) => {
          const paintId = h64(paint);
          if (!this._toTransformPaints.has(paintId)) {
            this._toTransformPaints.set(paintId, { paint, node });
          }
          paintIds.push(paintId);
        });
      }

      // Discover typeface
      if (isTextNode(node)) {
        const fontName = excludeMixed(node, 'fontName');
        const fontWeight = excludeMixed(node, 'fontWeight');
        const typeface: TTypefaceWithoutContent = {
          family: fontName.family,
          name: fontName.style,
          weight: fontWeight,
          style: fontName.style.toLowerCase().includes('italic')
            ? 'italic'
            : 'regular',
        };
        typefaceId = h64(typeface);
        if (!this._toTransformTypefaces.has(typefaceId)) {
          this._toTransformTypefaces.set(typefaceId, { node, typeface });
        }
      }

      this._toTransformNodes.push({
        id: nodeId,
        node,
        childrenIds,
        paintIds,
        typefaceId,
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
  typefaceId: string | null;
};

type TToTransformPaint = {
  id: string;
  node: SceneNode;
  paint: Paint;
};

type TToTransformTypeface = {
  id: string;
  node: TextNode;
  typeface: TTypefaceWithoutContent;
};
