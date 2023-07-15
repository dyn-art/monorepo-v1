import {
  TCreateRectanglePathProps,
  createRectanglePath,
} from '@/helpers/paths';
import { TD3SVGElementSelection } from '@/types';
import {
  TEffectsMixin,
  TFillsMixin,
  TGeometryMixin,
  TRectangleCornerMixin,
  TRectangleNode,
} from '@pda/types/dtif';
import { Scene } from '../Scene';
import { Node } from './Node';

export class Rectangle extends Node<Rectangle> {
  // Mixins
  private readonly _cornerMixin: TRectangleCornerMixin;
  private readonly _fillsMixin: TFillsMixin;
  private readonly _effectsMixin: TEffectsMixin;
  private readonly _geometryMixin: TGeometryMixin;

  // D3 ids
  private readonly _d3RootNodeId: string;
  private readonly _d3FillClipPathId: string;
  private readonly _d3FillClipPathDefsNodeId: string;
  private readonly _d3FillClippedShapeNodeId: string;

  constructor(
    parent: TD3SVGElementSelection,
    node: TRectangleNode,
    scene: Scene
  ) {
    super(node, scene, { type: 'rectangle' });

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
    this._d3FillClipPathId = this.getD3NodeId('fill-clip', true);
    this._d3FillClipPathDefsNodeId = this.getD3NodeId('fill-defs');
    this._d3FillClippedShapeNodeId = this.getD3NodeId('fill-clipped-shape');

    this.init(parent, node);
  }

  private async init(parent: TD3SVGElementSelection, node: TRectangleNode) {
    // Create D3 node
    this._d3Node = await Rectangle.createD3Node(parent, {
      node,
      ids: {
        rootNodeId: this._d3RootNodeId,
        fillClipPathId: this._d3FillClipPathId,
        fillClipPathDefsNodeId: this._d3FillClipPathDefsNodeId,
        fillClippedShapeNodeId: this._d3FillClippedShapeNodeId,
      },
    });
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

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
    parent: TD3SVGElementSelection,
    props: {
      node: TRectangleNode;
      ids: {
        rootNodeId: string;
        fillClipPathId: string;
        fillClipPathDefsNodeId: string;
        fillClippedShapeNodeId: string;
      };
    }
  ) {
    const {
      ids: {
        rootNodeId,
        fillClipPathId,
        fillClipPathDefsNodeId,
        fillClippedShapeNodeId,
      },
      node,
    } = props;

    // Create root element
    const root = await Node.createRootD3Node(parent, {
      node,
      id: rootNodeId,
    });

    // Create fill clip path element
    const fillClipPathDefsNode = root.append('defs', {
      id: fillClipPathDefsNodeId,
    });
    const fillClipPathNode = fillClipPathDefsNode?.append('clipPath', {
      id: fillClipPathId,
    });
    fillClipPathNode?.append('path', {
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

    // Create fill element
    // TODO:

    return root;
  }
}
