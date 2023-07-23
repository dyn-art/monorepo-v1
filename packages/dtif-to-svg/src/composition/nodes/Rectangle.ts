import {
  TCreateRectanglePathProps,
  createRectanglePath,
} from '@/helpers/paths';
import { TRectangleCornerMixin, TRectangleNode } from '@pda/types/dtif';
import { Composition } from '../Composition';
import { RemoveFunctions, Watcher } from '../Watcher';
import { Fill } from '../fill';
import { D3Node, Node, ShapeNode } from './base';

export class Rectangle extends ShapeNode {
  // Mixins
  private readonly _cornerMixin: TRectangleCornerMixin;

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3FillClipPathId: string;
  private readonly _d3FillClipPathDefsNodeId: string;
  private readonly _d3FillClippedShapeNodeId: string;
  private readonly _d3FillNodeId: string;

  protected readonly _watcher: Watcher<TWatchedRectangleNode>;

  // Init
  private _forInit: {
    node: TRectangleNode;
  } | null;

  constructor(node: TRectangleNode, scene: Composition) {
    super(node, scene, { type: 'rectangle' });
    this._forInit = {
      node,
    };

    // Apply mixins
    this._cornerMixin = {
      bottomLeftRadius: node.bottomLeftRadius,
      bottomRightRadius: node.bottomRightRadius,
      topLeftRadius: node.topLeftRadius,
      topRightRadius: node.topRightRadius,
    };

    // Define D3 node ids
    this._d3RootNodeId = this.getD3NodeId();
    this._d3FillClipPathId = this.getD3NodeId('fill-clip', true);
    this._d3FillClipPathDefsNodeId = this.getD3NodeId('fill-defs');
    this._d3FillClippedShapeNodeId = this.getD3NodeId('fill-clipped-shape');
    this._d3FillNodeId = this.getD3NodeId('fill');
  }

  public async init(parent: D3Node) {
    if (this._forInit == null) {
      return this;
    }
    const { node } = this._forInit;

    // Create D3 node
    this._d3Node = await Rectangle.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        fillClipPathId: this._d3FillClipPathId,
        fillClipPathDefsNodeId: this._d3FillClipPathDefsNodeId,
        fillClippedShapeNodeId: this._d3FillClippedShapeNodeId,
        fillNodeId: this._d3FillNodeId,
      },
    });

    // Retrieve fill wrapper node
    const fillWrapperNode = this._d3Node?.getChildNodeById(this._d3FillNodeId);
    if (fillWrapperNode == null) {
      return this;
    }
    // and append fill paints
    this._fill.init(fillWrapperNode);

    this._forInit = null;
    return this;
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public watcher() {
    return this._watcher;
  }

  public get bottomLeftRadius() {
    return this._cornerMixin.bottomLeftRadius;
  }

  public set bottomLeftRadius(value: number) {
    this._cornerMixin.bottomLeftRadius = value;
    this._d3Node
      ?.getChildNodeById(this._d3FillClippedShapeNodeId)
      ?.updateAttributes({
        p: this.updateRectanglePath({ bottomLeftRadius: value }),
      });
    this._watcher.notify('bottomLeftRadius', value);
  }

  // ============================================================================
  // Paths
  // ============================================================================

  private updateRectanglePath(props: Partial<TCreateRectanglePathProps>) {
    const defaultProps: TCreateRectanglePathProps = {
      width: this._layoutMixin.width,
      height: this._layoutMixin.height,
      topLeftRadius: this._cornerMixin.topLeftRadius,
      topRightRadius: this._cornerMixin.topRightRadius,
      bottomRightRadius: this._cornerMixin.bottomRightRadius,
      bottomLeftRadius: this._cornerMixin.bottomLeftRadius,
    };
    return createRectanglePath({ ...defaultProps, ...props });
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: D3Node,
    props: {
      node: TRectangleNode;
      ids: {
        rootNodeId: string;
        fillClipPathId: string;
        fillClipPathDefsNodeId: string;
        fillClippedShapeNodeId: string;
        fillNodeId: string;
      };
    }
  ) {
    const {
      ids: {
        rootNodeId,
        fillClipPathId,
        fillClipPathDefsNodeId,
        fillClippedShapeNodeId,
        fillNodeId,
      },
      node,
    } = props;

    // Create root element
    const root = await Node.createWrapperD3Node(parent, {
      id: rootNodeId,
      node,
    });

    // Create fill clip path element
    const fillClipPathDefsNode = root.append('defs', {
      id: fillClipPathDefsNodeId,
    });
    const fillClipPathNode = fillClipPathDefsNode.append('clipPath', {
      id: fillClipPathId,
    });
    fillClipPathNode.append('path', {
      id: fillClippedShapeNodeId,
      attributes: {
        p: createRectanglePath({
          width: node.width,
          height: node.height,
          topLeftRadius: node.topLeftRadius,
          topRightRadius: node.topRightRadius,
          bottomRightRadius: node.bottomRightRadius,
          bottomLeftRadius: node.bottomLeftRadius,
        }),
      },
    });

    // Create fill wrapper element
    await Fill.createFillWrapperD3Node(root, {
      id: fillNodeId,
      clipPathId: fillClipPathId,
    });

    return root;
  }
}

type TWatchedRectangleNode = RemoveFunctions<Rectangle>;
