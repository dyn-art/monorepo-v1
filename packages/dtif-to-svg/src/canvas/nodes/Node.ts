import { transformToCSS } from '@/helpers/css';
import { getElementId } from '@/helpers/other';
import {
  TBlendMixin,
  TLayoutMixin,
  TNode,
  TSceneNodeMixin,
  TTransform,
} from '@pda/types/dtif';
import { matrix, multiply } from 'mathjs';
import { Scene } from '../Scene';
import { Watcher } from '../Watcher';
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

  public get width() {
    return this._layoutMixin.width;
  }

  public get height() {
    return this._layoutMixin.height;
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

  public move(mx: number, my: number) {
    const translateMatrix = matrix([
      [1, 0, mx],
      [0, 1, my],
      [0, 0, 1],
    ]);

    // Multiply translate by relativeTransform to apply the translation
    this.relativeTransform = multiply(
      translateMatrix,
      this.relativeTransform
    ).toArray() as TTransform;
  }

  public rotate(angleInDegrees: number) {
    // Convert the angle from degrees to radians
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    // Calculate the center of the object
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Calculate the new coordinates of the top-left corner after rotation
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    const nx = centerX * (1 - cos) + centerY * sin;
    const ny = centerY * (1 - cos) - centerX * sin;

    // Create the rotation matrix
    const rotationMatrix: TTransform = [
      [cos, -sin, nx],
      [sin, cos, ny],
      [0, 0, 1],
    ];

    // Update the relative transform of the object
    this.relativeTransform = multiply(this.relativeTransform, rotationMatrix);
  }

  public getAngleInDegrees(): number {
    // Extract rotation from transformation matrix
    const angleInRadians = Math.atan2(
      -this.relativeTransform[1][0],
      this.relativeTransform[0][0]
    );

    // Convert the angle from radians to degrees
    let angleInDegrees = (angleInRadians * 180) / Math.PI;

    // Normalize the angle to the range [-180, 180]
    while (angleInDegrees < -180) angleInDegrees += 360;
    while (angleInDegrees > 180) angleInDegrees -= 360;

    return angleInDegrees;
  }

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
    parent: D3Node,
    props: { node: TNode; id: string }
  ) {
    const { id, node } = props;

    // Create root element
    const element = parent.append('g', {
      id,
      styles: {
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        ...transformToCSS(node.relativeTransform),
      },
    });

    return element;
  }
}

export type TNodeOptions = {
  type?: string;
};
