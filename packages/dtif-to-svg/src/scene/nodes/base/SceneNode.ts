import { transformToCSS } from '@/helpers/css';
import { copyMatrix } from '@/helpers/math';
import { getElementId } from '@/helpers/other';
import {
  TBlendMixin,
  TLayoutMixin,
  TNode,
  TSceneNodeMixin,
  TTransform,
} from '@pda/types/dtif';
import { matrix, multiply } from 'mathjs';
import { Scene } from '../../Scene';
import { D3Node } from './D3Node';
import { Node, TNodeOptions } from './Node';

export class SceneNode<
  GWatchedObj extends SceneNode<any> = SceneNode<any>
> extends Node<GWatchedObj> {
  // Mixins
  protected readonly _sceneMixin: TSceneNodeMixin;
  protected readonly _layoutMixin: TLayoutMixin;
  protected readonly _blendMixin: TBlendMixin;

  // D3
  protected _d3Node: D3Node | null;

  constructor(node: TNode, scene: Scene, options: TNodeOptions = {}) {
    super(node, scene, options);

    // Apply mixins
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
  }

  // ============================================================================
  // Setter & Getter
  // ============================================================================

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
  // Interaction
  // ============================================================================

  public move(mx: number, my: number) {
    const translateMatrix = matrix([
      [1, 0, mx],
      [0, 1, my],
      [0, 0, 1],
    ]);
    this.relativeTransform = multiply(
      translateMatrix,
      this.relativeTransform
    ).toArray() as TTransform;
  }

  public moveTo(mx: number, my: number) {
    const copiedTransform = copyMatrix(this.relativeTransform);
    copiedTransform[0][2] = mx;
    copiedTransform[1][2] = my;
    this.relativeTransform = copiedTransform;
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

  // ============================================================================
  // D3
  // ============================================================================

  public onClickRoot(callback: (event: any, node: Node) => void) {
    this._d3Node?.element.on('click', (e) => {
      callback(e, this);
    });
  }

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
    const rootWrapperNode = parent.append('g', {
      id,
      styles: {
        display: node.isVisible ? 'block' : 'none',
        opacity: node.opacity,
        ...transformToCSS(node.relativeTransform),
      },
    });

    return rootWrapperNode;
  }
}
