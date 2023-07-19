import { Scene } from '@/scene/Scene';
import { Fill } from '@/scene/fill';
import {
  TEffectsMixin,
  TEllipseNode,
  TFrameNode,
  TGeometryMixin,
  TPolygonNode,
  TRectangleNode,
  TStarNode,
  TTextNode,
} from '@pda/types/dtif';
import { TNodeOptions } from './Node';
import { SceneNode } from './SceneNode';

export class ShapeNode<
  GWatchedObj extends ShapeNode<any> = ShapeNode<any>
> extends SceneNode<GWatchedObj> {
  // Mixins
  protected readonly _effectsMixin: TEffectsMixin; // TODO: do like fill
  protected readonly _geometryMixin: TGeometryMixin;

  protected _fill: Fill;

  constructor(node: TShapeNode, scene: Scene, options: TNodeOptions = {}) {
    super(node, scene, options);
    this._fill = new Fill(node.fills, this);

    // Apply mixins
    this._effectsMixin = {
      effects: node.effects,
    };
    this._geometryMixin = {
      fillGeometry: node.fillGeometry,
      strokeGeometry: node.strokeGeometry,
    };
  }

  // ============================================================================
  // Getter & Setter
  // ============================================================================

  public get fill() {
    return this._fill;
  }
}

type TShapeNode =
  | TRectangleNode
  | TStarNode
  | TPolygonNode
  | TTextNode
  | TFrameNode
  | TEllipseNode;
