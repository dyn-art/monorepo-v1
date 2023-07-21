import { Scene } from '@/scene/Scene';
import { RemoveFunctions, Watcher } from '@/scene/Watcher';
import { TNode } from '@pda/types/dtif';

export abstract class Node {
  protected readonly _type: string;

  // Base node mixin
  protected readonly _id: string;
  protected _name: string;

  protected readonly _scene: () => Scene;
  protected readonly _watcher: Watcher<TWatchedNode>;

  constructor(node: TNode, scene: Scene, options: TNodeOptions = {}) {
    const { type = 'node' } = options;
    this._id = node.id;
    this._type = type;
    this._name = node.name;
    this._watcher = new Watcher();
    this._scene = () => scene;
  }

  // ============================================================================
  // Setter & Getter
  // ============================================================================

  public watcher() {
    return this._watcher;
  }

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

  public get scene() {
    return this._scene();
  }
}

type TWatchedNode = RemoveFunctions<Node>;

export type TNodeOptions = {
  type?: string;
};
