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
import { Composition } from '../../Composition';
import { RemoveFunctions, Watcher } from '../../Watcher';
import { Fill } from '../../fill';
import { CompositionNode, TNodeOptions } from './CompositionNode';

export abstract class ShapeNode extends CompositionNode {
  protected _fill: Fill;

  // Mixins
  protected readonly _effectsMixin: TEffectsMixin; // TODO: do like fill
  protected readonly _geometryMixin: TGeometryMixin;

  protected readonly _watcher: Watcher<TWatchedShapeNode>;

  constructor(
    node: TShapeNode,
    scene: Composition,
    options: TNodeOptions = {}
  ) {
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

  public getWatcher() {
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
