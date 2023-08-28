import {
  TComposition,
  TFrameNode,
  TRectangleCornerMixin,
} from '@dyn/types/dtif';
import { notEmpty } from '@dyn/utils';
import { Composition } from '../Composition';
import { RemoveFunctions, Watcher } from '../Watcher';
import { appendNode } from '../append';
import { Fill } from '../fill';
import { CompositionNode, D3Node, ShapeNode } from './base';

export class Frame extends ShapeNode {
  private _childrenIds: string[];

  // Mixins
  private readonly _cornerMixin: TRectangleCornerMixin;

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3ContentClipPathId: string;
  private readonly _d3ContentClipPathDefsNodeId: string;
  private readonly _d3ContentClippedShapeNodeId: string;
  private readonly _d3FillClipPathId: string;
  private readonly _d3FillClipPathDefsNodeId: string;
  private readonly _d3FillClippedShapeNodeId: string;
  private readonly _d3FillNodeId: string;
  private readonly _d3ContentWrapperNodeId: string;
  private readonly _d3ChildrenWrapperNodeId: string;

  protected readonly _watcher: Watcher<TWatchedFrameNode>;

  // Init
  private _forInit: {
    node: TFrameNode;
  } | null;

  constructor(id: string, node: TFrameNode, composition: Composition) {
    super(id, node, composition, { type: 'frame' });
    this._forInit = {
      node,
    };

    this._childrenIds = [];

    // Apply mixins
    this._cornerMixin = {
      bottomLeftRadius: node.bottomLeftRadius,
      bottomRightRadius: node.bottomRightRadius,
      topLeftRadius: node.topLeftRadius,
      topRightRadius: node.topRightRadius,
    };

    // Define D3 node ids
    this._d3RootNodeId = this.getD3NodeId();
    this._d3ContentClipPathId = this.getD3NodeId('content-clip', true);
    this._d3ContentClipPathDefsNodeId = this.getD3NodeId('content-defs');
    this._d3ContentClippedShapeNodeId = this.getD3NodeId(
      'content-clipped-shape'
    );
    this._d3FillClipPathId = this.getD3NodeId('fill-clip', true);
    this._d3FillClipPathDefsNodeId = this.getD3NodeId('fill-defs');
    this._d3FillClippedShapeNodeId = this.getD3NodeId('fill-clipped-shape');
    this._d3FillNodeId = this.getD3NodeId('fill');
    this._d3ContentWrapperNodeId = this.getD3NodeId('content');
    this._d3ChildrenWrapperNodeId = this.getD3NodeId('children');
  }

  public async init(parent: D3Node, dtifComposition: TComposition) {
    if (this._forInit == null) {
      return this;
    }
    const { node } = this._forInit;

    // Create D3 node
    this._d3Node = await Frame.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        contentClipPathId: this._d3ContentClipPathId,
        contentClipPathDefsNodeId: this._d3ContentClipPathDefsNodeId,
        contentClippedShapeNodeId: this._d3ContentClippedShapeNodeId,
        fillClipPathId: this._d3FillClipPathId,
        fillClipPathDefsNodeId: this._d3FillClipPathDefsNodeId,
        fillClippedShapeNodeId: this._d3FillClippedShapeNodeId,
        fillNodeId: this._d3FillNodeId,
        contentWrapperNodeId: this._d3ContentWrapperNodeId,
        childrenWrapperNodeId: this._d3ChildrenWrapperNodeId,
      },
    });

    // Retrieve children wrapper node
    const childWrapperNode = this._d3Node?.getChildNodeById(
      this._d3ChildrenWrapperNodeId
    );
    if (childWrapperNode == null) {
      return this;
    }
    // and append children
    await Promise.all(
      node.childIds.map(async (childId) => {
        // Create node
        const node = await appendNode(childWrapperNode, {
          id: childId,
          node: dtifComposition.nodes[childId],
          composition: this.composition,
          dtifComposition,
        });
        if (node != null) {
          // Add node to composition
          this.composition.addNode(node);

          // Add id to this nodes children ids
          this._childrenIds.push(node.id);
        }
      })
    );

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

  public get children(): CompositionNode[] {
    return this._childrenIds
      .map((id) => this.composition.getNode(id))
      .filter(notEmpty);
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: D3Node,
    props: {
      node: TFrameNode;
      ids: {
        rootNodeId: string;
        contentClipPathId: string;
        contentClipPathDefsNodeId: string;
        contentClippedShapeNodeId: string;
        fillClipPathId: string;
        fillClipPathDefsNodeId: string;
        fillClippedShapeNodeId: string;
        fillNodeId: string;
        contentWrapperNodeId: string;
        childrenWrapperNodeId: string;
      };
    }
  ) {
    const {
      ids: {
        rootNodeId,
        contentClipPathId,
        contentClipPathDefsNodeId,
        contentClippedShapeNodeId,
        fillClipPathId,
        fillClipPathDefsNodeId,
        fillClippedShapeNodeId,
        fillNodeId,
        contentWrapperNodeId,
        childrenWrapperNodeId,
      },
      node,
    } = props;

    // Create root element
    const root = await CompositionNode.createWrapperD3Node(parent, {
      id: rootNodeId,
      node: props.node,
    });

    // Create content element
    const contentWrapperNode = root.append('g', {
      id: contentWrapperNodeId,
      attributes: {
        clipPath: node.clipsContent ? `url(#${contentClipPathId})` : undefined,
      },
    });

    // Create fill clip path element
    const fillClipPathDefsNode = contentWrapperNode.append('defs', {
      id: fillClipPathDefsNodeId,
    });
    const fillClipPathNode = fillClipPathDefsNode.append('clipPath', {
      id: fillClipPathId,
    });
    fillClipPathNode.append('rect', {
      id: fillClippedShapeNodeId,
      attributes: {
        width: node.width,
        height: node.height,
      },
    });

    // Create fill wrapper element
    await Fill.createFillWrapperD3Node(contentWrapperNode, {
      id: fillNodeId,
      clipPathId: fillClipPathId,
    });

    // Create children wrapper element
    await Frame.createChildrenWrapperD3Node(contentWrapperNode, {
      id: childrenWrapperNodeId,
    });

    // Create content clip path element
    if (node.clipsContent) {
      const contentClipPathDefsNode = root.append('defs', {
        id: contentClipPathDefsNodeId,
      });
      const contentClipPathNode = contentClipPathDefsNode.append('clipPath', {
        id: contentClipPathId,
      });
      contentClipPathNode.append('rect', {
        id: contentClippedShapeNodeId,
        attributes: {
          width: node.width,
          height: node.height,
        },
      });
    }

    return root;
  }

  public static async createChildrenWrapperD3Node(
    parent: D3Node,
    props: { id: string }
  ) {
    const { id } = props;

    // Create child wrapper element
    // and set 'children' property to null because any children
    // appended to this wrapper are not considered in the context of the current node anymore
    const childWrapperNode = parent.append('g', {
      id,
      children: null,
    });

    return childWrapperNode;
  }
}

type TWatchedFrameNode = RemoveFunctions<Frame>;
