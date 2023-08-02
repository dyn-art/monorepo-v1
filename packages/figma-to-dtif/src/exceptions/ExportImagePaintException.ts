import { extractErrorData } from '@pda/utils';
import { PaintException } from './PaintException';

export class ExportImagePaintException extends PaintException {
  public readonly error?: Error;

  constructor(node?: SceneNode, error?: any) {
    const errorData = error != null ? extractErrorData(error) : null;
    super(
      `Failed to export image paint${
        node != null ? `from node '${node.name}' ` : ''
      }${errorData != null ? ` by error: ${errorData.message}` : '!'}`,
      node
    );
    this.error = errorData?.error ?? undefined;
  }
}
