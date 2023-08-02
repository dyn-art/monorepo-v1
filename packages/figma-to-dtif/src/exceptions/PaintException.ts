export class PaintException extends Error {
  public readonly node?: SceneNode;

  constructor(message: string, node?: SceneNode) {
    super(message);
    this.node = node;
  }
}
