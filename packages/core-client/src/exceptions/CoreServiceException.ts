export class CoreServiceException extends Error {
  public readonly status?: number;
  public readonly code: string;
  public readonly description: string;
  public readonly throwable?: Error;

  constructor(
    code: string,
    description: string,
    options: {
      status?: number;
      throwable?: Error;
    }
  ) {
    const { status, throwable } = options;
    super(
      `Call to endpoint failed${
        status != null ? ` with status '${status}'` : ''
      }: ${code != null ? `[${code}] ` : ''}${description}`
    );
    this.code = code;
    this.description = description;
    this.status = status;
    this.throwable = throwable;
  }
}
