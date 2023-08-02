import { extractErrorData } from '@pda/utils';
import { NodeException } from './NodeException';

export class ExportNodeException extends NodeException {
  public readonly error?: Error;

  constructor(format: string, node: SceneNode, error?: any) {
    const errorData = error != null ? extractErrorData(error) : null;
    super(
      `Failed to export node '${node.name}' as ${format}${
        errorData != null ? ` by error: ${errorData.message}` : '!'
      }`,
      node
    );
    this.error = errorData?.error ?? undefined;
  }
}
