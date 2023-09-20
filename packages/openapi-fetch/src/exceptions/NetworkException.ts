import { ServiceException } from './ServiceException';

export class NetworkException extends ServiceException {
  public readonly throwable?: Error;

  constructor(
    code: string,
    options: {
      description?: string;
      throwable?: Error;
    } = {}
  ) {
    const { throwable, description } = options;
    super(code, {
      description,
      message: `Call to endpoint failed with network error ${code}${
        description != null ? `: ${description}` : '!'
      }`,
    });
    this.throwable = throwable;
  }
}
