import { Scene } from '@/scene/Scene';
import { RemoveFunctions, Watcher } from '@/scene/Watcher';
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

export abstract class ShapeNode extends SceneNode {
  // Mixins
  protected readonly _effectsMixin: TEffectsMixin; // TODO: do like fill
  protected readonly _geometryMixin: TGeometryMixin;

  protected _fill: Fill;
  protected readonly _watcher: Watcher<TWatchedShapeNode>;

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

  public watcher() {
    return this._watcher;
  }

  public get fill() {
    return this._fill;
  }
}

type TWatchedShapeNode = RemoveFunctions<ShapeNode>;

type TShapeNode =
  | TRectangleNode
  | TStarNode
  | TPolygonNode
  | TTextNode
  | TFrameNode
  | TEllipseNode;
