import { NodeException } from './NodeException';

export class ExportNodeException extends NodeException {
  public readonly error?: Error;

  constructor(format: string, node: SceneNode, error?: any) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    super(
      `Failed to export node '${node.name}' as ${format} by error: ${errorMessage}`,
      node
    );
    this.error = error instanceof Error ? error : undefined;
  }
}
