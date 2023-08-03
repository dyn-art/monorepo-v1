import { extractErrorData } from '@pda/utils';
import { NodeException } from './NodeException';

export class UploadStaticDataException extends NodeException {
  public readonly throwable?: Error;

  constructor(key: string, node: SceneNode, throwable?: unknown) {
    const errorData = throwable != null ? extractErrorData(throwable) : null;
    super(
      `Failed to upload node data at the key '${key}'${
        errorData != null ? ` by error: ${errorData.message}` : '!'
      }`,
      node
    );
    this.throwable = errorData?.error ?? undefined;
  }
}
