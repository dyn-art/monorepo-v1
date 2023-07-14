import {
  TBlendMixin,
  TLayoutMixin,
  TNode,
  TSceneNodeMixin,
} from '@pda/types/dtif';
import { TD3SVGElementSelection } from '../../types';

export class Node {
  // Base node mixin
  private readonly _id: string;
  private readonly _name: string;

  // Other mixin's
  private readonly _sceneMixin: TSceneNodeMixin;
  private readonly _layoutMixin: TLayoutMixin;
  private readonly _blendMixin: TBlendMixin;

  // D3
  private readonly _d3Node: TD3SVGElementSelection;

  constructor(parent: TD3SVGElementSelection, node: TNode) {
    this._id = node.id;
    this._name = node.name;
    this._sceneMixin = {
      isLocked: node.isLocked,
      isVisible: node.isVisible,
    };
    this._layoutMixin = {
      height: node.height,
      width: node.width,
      relativeTransform: node.relativeTransform,
    };
    this._blendMixin = {
      blendMode: node.blendMode,
      isMask: node.isMask,
      opacity: node.opacity,
    };
    // TODO should be set by child I guess or I wrap each node in g as
    // all nodes have transform
    this._d3Node = parent.append('g');
  }
}
