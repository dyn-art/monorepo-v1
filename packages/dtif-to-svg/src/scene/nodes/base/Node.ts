import { TNode } from '@pda/types/dtif';
import { Scene } from '../../Scene';
import { Watcher } from '../../Watcher';

export abstract class Node<GWatchedObj extends Node<any> = Node<any>> {
  protected readonly _type;

  // Base node mixin
  protected readonly _id: string;
  protected _name: string;

  protected readonly _watcher: Watcher<GWatchedObj>;
  protected readonly _scene: Scene;

  constructor(node: TNode, scene: Scene, options: TNodeOptions = {}) {
    const { type = 'node' } = options;
    this._id = node.id;
    this._name = node.name;

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

  // ============================================================================
  // Callbacks
  // ============================================================================

  public watch<K extends keyof GWatchedObj>(
    property: K,
    callback: (value: GWatchedObj[K]) => void
  ) {
    this._watcher.watch(property, callback);
  }
}

export type TNodeOptions = {
  type?: string;
};
