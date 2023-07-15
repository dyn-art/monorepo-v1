import { transformToCSS } from '@/helpers/css';
import { appendAttributes, appendCSS } from '@/helpers/d3';
import { getElementId } from '@/helpers/other';
import { TD3SVGElementSelection } from '@/types';
import {
  TBlendMixin,
  TLayoutMixin,
  TNode,
  TSceneNodeMixin,
  TTransform,
} from '@pda/types/dtif';
import { Scene } from '../Scene';
import { D3Node } from './D3Node';

export abstract class Node<GWatchedObj extends Node<any> = Node<any>> {
  protected readonly _type;

  // Base node mixin
  protected readonly _id: string;
  protected _name: string;

  // Other mixin's
  protected readonly _sceneMixin: TSceneNodeMixin;
  protected readonly _layoutMixin: TLayoutMixin;
  protected readonly _blendMixin: TBlendMixin;

  // D3
  protected _d3Node: D3Node | null;

  protected readonly _watcher: Watcher<GWatchedObj>;
  protected readonly _scene: Scene;

  constructor(node: TNode, scene: Scene, options: TNodeOptions = {}) {
    const { type = 'node' } = options;
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
    this._d3Node = null; // Set by sub class
    this._watcher = new Watcher();
    this._scene = scene;
    this._type = type;
  }

  // ============================================================================
  // Setter & Getter
  // ============================================================================

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
    this._watcher.notify('name', value);
  }

  public get relativeTransform() {
    return this._layoutMixin.relativeTransform;
  }

  public set relativeTransform(value: TTransform) {
    this._layoutMixin.relativeTransform = value;
    this._d3Node?.updateStyles(transformToCSS(value));
    this._watcher.notify('relativeTransform', this.relativeTransform);
  }

  // ============================================================================
  // Other
  // ============================================================================

  public watch<K extends keyof GWatchedObj>(
    property: K,
    callback: (value: GWatchedObj[K]) => void
  ) {
    this._watcher.watch(property, callback);
  }

  // ============================================================================
  // D3
  // ============================================================================

  protected getD3NodeId(category?: string, isDefinition = false) {
    return getElementId({
      id: this._id,
      type: this._type,
      category,
      isDefinition,
    });
  }

  public static async createRootD3Node(
    parent: TD3SVGElementSelection,
    props: { node: TNode; id: string }
  ) {
    const {
      node: { opacity, relativeTransform, isVisible, id },
    } = props;

    // Create root element
    const element = parent.append('g');
    appendAttributes(element, {
      id,
    });
    appendCSS(element, {
      display: isVisible ? 'block' : 'none',
      opacity: opacity,
      ...transformToCSS(relativeTransform),
    });

    // Create root node
    return new D3Node('g', element, { id });
  }
}

export type TNodeOptions = {
  type?: string;
};
