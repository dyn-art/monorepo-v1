export class ServiceException extends Error {
  public readonly status?: number;
  public readonly code: string;
  public readonly description?: string;
  public readonly throwable?: Error;

  constructor(
    code: string,
    options: {
      description?: string;
      status?: number;
      throwable?: Error;
    } = {}
  ) {
    const { status, throwable, description } = options;
    super(
      `Call to endpoint failed with${
        status != null ? ` status ${status} and` : ''
      } error code ${code}${description != null ? `: ${description}` : '!'}`
    );
    this.code = code;
    this.description = description;
    this.status = status;
    this.throwable = throwable;
  }
}
