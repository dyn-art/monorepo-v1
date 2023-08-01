import { extractErrorData } from '@/helpers';
import { NodeException } from './NodeException';

export class ExportNodeException extends NodeException {
  public readonly error?: Error;

  constructor(format: string, node: SceneNode, error?: any) {
    const errorData = extractErrorData(error);
    super(
      `Failed to export node '${node.name}' as ${format} by error: ${errorData.message}`,
      node
    );
    this.error = errorData.error ?? undefined;
  }
}
