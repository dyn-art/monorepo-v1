import { getElementId } from '@/helpers/other';
import { createRectanglePath } from '@/helpers/paths';
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
  private readonly _cornerMixin: TRectangleCornerMixin;
  private readonly _fillsMixin: TFillsMixin;
  private readonly _effectsMixin: TEffectsMixin;
  private readonly _geometryMixin: TGeometryMixin;

  constructor(
    parent: TD3SVGElementSelection,
    node: TRectangleNode,
    scene: Scene
  ) {
    super(node, scene, { type: 'rectangle' });
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

    // Create D3 node
    Rectangle.createD3Node(parent, { node, type: this._type }).then(
      (result) => {
        this._d3Node = result;
      }
    );
  }

  // ============================================================================
  // Setter & Getter
  // ============================================================================

  public get bottomLeftRadius() {
    return this._cornerMixin.bottomLeftRadius;
  }

  public set bottomLeftRadius(value: number) {
    this._cornerMixin.bottomLeftRadius = value;
    // TODO: make more reuseable
    // 1. the id should be in like this._d3Ids or so
    // 2. create rectangle path should be outsourced so it can be reused
    this._d3Node
      ?.getChildNodeById(
        getElementId({
          id: this._id,
          type: this._type,
          category: 'shape',
        })
      )
      ?.updateAttributes({
        p: createRectanglePath({
          width: this._layoutMixin.width,
          height: this._layoutMixin.height,
          topLeftRadius: this._cornerMixin.topLeftRadius,
          topRightRadius: this._cornerMixin.topRightRadius,
          bottomRightRadius: this._cornerMixin.bottomRightRadius,
          bottomLeftRadius: this._cornerMixin.bottomLeftRadius,
        }),
      });
    this._watcher.notify('bottomLeftRadius', value);
  }

  // ============================================================================
  // D3
  // ============================================================================

  public static async createD3Node(
    parent: TD3SVGElementSelection,
    props: { node: TRectangleNode; type: string }
  ) {
    const {
      type,
      node: {
        id,
        width,
        height,
        topLeftRadius,
        topRightRadius,
        bottomLeftRadius,
        bottomRightRadius,
      },
    } = props;
    const fillClipPathId = getElementId({
      id,
      type,
      category: 'fill-clip',
      isDefinition: true,
    });

    const root = Node.createRootD3Node(parent, { node: props.node, type });
    const clipPathDefsNode = root.append('defs', {
      id: getElementId({
        id,
        type,
        category: 'fill-defs',
      }),
    });
    const clipPathNode = clipPathDefsNode.append('clipPath', {
      id: fillClipPathId,
    });
    clipPathNode.append('path', {
      id: getElementId({
        id,
        type,
        category: 'shape',
      }),
      attributes: {
        p: createRectanglePath({
          width,
          height,
          topLeftRadius,
          topRightRadius,
          bottomRightRadius,
          bottomLeftRadius,
        }),
      },
    });

    return root;
  }
}
