export class CoreServiceException extends Error {
  public readonly statusCode?: number;
  public readonly throwable?: Error;

  constructor(args: {
    message: string;
    statusCode?: number;
    throwable?: Error;
  }) {
    const { message, statusCode, throwable } = args;
    super(
      `Call to endpoint failed${
        statusCode ? ` with status '${statusCode}'` : ''
      }: ${message}`
    );
    this.statusCode = statusCode;
    this.throwable = throwable;
  }
}
