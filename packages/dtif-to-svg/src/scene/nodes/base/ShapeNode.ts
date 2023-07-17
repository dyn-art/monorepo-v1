import { TEffectsMixin, TGeometryMixin, TNode } from '@pda/types/dtif';
import { Scene } from '../../Scene';
import { Fill } from '../../fill';
import { TNodeOptions } from './Node';
import { SceneNode } from './SceneNode';

// TBaseShapeMixin
export class ShapeNode<
  GWatchedObj extends ShapeNode<any> = ShapeNode<any>
> extends SceneNode<GWatchedObj> {
  // Mixins
  protected readonly _effectsMixin: TEffectsMixin;
  protected readonly _geometryMixin: TGeometryMixin;

  // Fills
  protected readonly _fills: Fill[];

  constructor(node: TNode, scene: Scene, options: TNodeOptions = {}) {
    super(node, scene, options);

    // Apply mixins
    // TODO: add check whether Node is ShapeNode
    this._effectsMixin = {
      effects: node['effects'] ?? [],
    };
    this._geometryMixin = {
      fillGeometry: node['fillGeometry'],
      strokeGeometry: node['strokeGeometry'],
    };

    // TODO: fills
  }
}
