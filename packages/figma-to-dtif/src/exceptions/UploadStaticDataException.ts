import { extractErrorData } from '@pda/utils';
import { NodeException } from './NodeException';

export class UploadStaticDataException extends NodeException {
  public readonly error?: Error;

  constructor(key: string, node: SceneNode, error?: any) {
    const errorData = error != null ? extractErrorData(error) : null;
    super(
      `Failed to upload node data at the key '${key}'${
        errorData != null ? ` by error: ${errorData.message}` : '!'
      }`,
      node
    );
    this.error = errorData?.error ?? undefined;
  }
}
