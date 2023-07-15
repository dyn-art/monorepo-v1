import { TD3SVGElementSelection } from '@/types';
import {
  TEffectsMixin,
  TFillsMixin,
  TFrameNode,
  TGeometryMixin,
  TRectangleCornerMixin,
} from '@pda/types/dtif';
import { Scene } from '../Scene';
import { appendNode } from '../append-node';
import { Node } from './Node';

export class Frame extends Node<Frame> {
  // Mixins
  private readonly _cornerMixin: TRectangleCornerMixin;
  private readonly _fillsMixin: TFillsMixin;
  private readonly _effectsMixin: TEffectsMixin;
  private readonly _geometryMixin: TGeometryMixin;

  private readonly _childrenIds: string[];

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3ContentClipPathId: string;
  private readonly _d3ContentClipPathDefsNodeId: string;
  private readonly _d3ContentClippedShapeNodeId: string;
  private readonly _d3FillClipPathId: string;
  private readonly _d3FillClipPathDefsNodeId: string;
  private readonly _d3FillClippedShapeNodeId: string;
  private readonly _d3ContentWrapperNodeId: string;
  private readonly _d3ChildrenWrapperNodeId: string;

  constructor(parent: TD3SVGElementSelection, node: TFrameNode, scene: Scene) {
    super(node, scene, { type: 'frame' });

    // Apply mixins
    this._cornerMixin = {
      bottomLeftRadius: node.bottomLeftRadius,
      bottomRightRadius: node.bottomRightRadius,
      topLeftRadius: node.topLeftRadius,
      topRightRadius: node.topRightRadius,
    };
    this._fillsMixin = {
      fills: node.fills,
    };
    this._effectsMixin = {
      effects: node.effects,
    };
    this._geometryMixin = {
      fillGeometry: node.fillGeometry,
      strokeGeometry: node.strokeGeometry,
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
    this._d3ContentWrapperNodeId = this.getD3NodeId('content');
    this._d3ChildrenWrapperNodeId = this.getD3NodeId('children');

    this.init(parent, node);
  }

  private async init(parent: TD3SVGElementSelection, node: TFrameNode) {
    // Create D3 node
    const d3Node = await Frame.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        contentClipPathId: this._d3ContentClipPathId,
        contentClipPathDefsNodeId: this._d3ContentClipPathDefsNodeId,
        contentClippedShapeNodeId: this._d3ContentClippedShapeNodeId,
        fillClipPathId: this._d3FillClipPathId,
        fillClipPathDefsNodeId: this._d3FillClipPathDefsNodeId,
        fillClippedShapeNodeId: this._d3FillClippedShapeNodeId,
        contentWrapperNodeId: this._d3ContentWrapperNodeId,
        childrenWrapperNodeId: this._d3ChildrenWrapperNodeId,
      },
    });

    // Retrieve children wrapper node
    const childWrapperNode = this._d3Node?.getChildNodeById(
      this._d3ChildrenWrapperNodeId
    );
    if (childWrapperNode == null) {
      return;
    }

    node.children.map(async (child) => {
      // Create node
      const node = await appendNode(childWrapperNode.element, {
        node: child,
        scene: this._scene,
      });
      if (node != null) {
        // Add node to scene
        this._scene.addNode(node);

        // Add id to this nodes children ids
        this._childrenIds.push(node.id);
      }
    });

    this._d3Node = d3Node;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  // TODO:

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: TD3SVGElementSelection,
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
        contentWrapperNodeId,
        childrenWrapperNodeId,
      },
      node,
    } = props;

    // Create root element
    const root = await Node.createRootD3Node(parent, {
      node: props.node,
      id: rootNodeId,
    });

    // Create content element
    const contentWrapperNode = root.append('g', {
      id: contentWrapperNodeId,
      attributes: {
        clipPath: node.clipsContent ? `url(#${contentClipPathId})` : undefined,
      },
    });

    // Create fill clip path element
    const fillClipPathDefsNode = contentWrapperNode?.append('defs', {
      id: fillClipPathDefsNodeId,
    });
    const fillClipPathNode = fillClipPathDefsNode?.append('clipPath', {
      id: fillClipPathId,
    });
    fillClipPathNode?.append('rect', {
      id: fillClippedShapeNodeId,
      attributes: {
        width: node.width,
        height: node.height,
      },
    });

    // Create fill element
    // TODO:

    // Create a child wrapper element
    // and set 'children' property to null because any children
    // appended to this wrapper are not considered in the context of the current node anymore
    root.append('g', { id: childrenWrapperNodeId, children: null });

    // Create content clip path element
    if (node.clipsContent) {
      const contentClipPathDefsNode = contentWrapperNode?.append('defs', {
        id: contentClipPathDefsNodeId,
      });
      const contentClipPathNode = contentClipPathDefsNode?.append('clipPath', {
        id: fillClipPathId,
      });
      contentClipPathNode?.append('rect', {
        id: contentClippedShapeNodeId,
        attributes: {
          width: node.width,
          height: node.height,
        },
      });
    }

    return root;
  }
}
