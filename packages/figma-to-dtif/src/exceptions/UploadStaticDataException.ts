import { NodeException } from './NodeException';

export class UploadStaticDataException extends NodeException {
  public readonly error?: Error;

  constructor(key: string, node: SceneNode, error?: any) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    super(
      `Failed to upload node data at the key '${key}' by error: ${errorMessage}`,
      node
    );
    this.error = error instanceof Error ? error : undefined;
  }
}
