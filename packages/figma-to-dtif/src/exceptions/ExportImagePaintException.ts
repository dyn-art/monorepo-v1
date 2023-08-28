import { extractErrorData } from '@dyn/utils';
import { PaintException } from './PaintException';

export class ExportImagePaintException extends PaintException {
  public readonly throwable?: Error;

  constructor(node?: SceneNode, throwable?: unknown) {
    const errorData = throwable != null ? extractErrorData(throwable) : null;
    super(
      `Failed to export image paint${
        node != null ? `from node '${node.name}' ` : ''
      }${errorData != null ? ` by error: ${errorData.message}` : '!'}`,
      node
    );
    this.throwable = errorData?.error ?? undefined;
  }
}
