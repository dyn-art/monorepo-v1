import { NodeException } from './NodeException';

export class ExportNodeException extends NodeException {
  public readonly error?: Error;

  constructor(message: string, node: SceneNode, error?: Error) {
    super(message, node);
    this.error = error;
  }
}
