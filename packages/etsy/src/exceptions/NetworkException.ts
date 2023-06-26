export class NetworkException extends Error {
  public readonly code: string | number;
  public readonly throwable?: Error;

  constructor(args: {
    message: string;
    code: string | number;
    throwable?: Error;
  }) {
    const { message, code, throwable } = args;
    super(`${code}: ${message}`);
    this.code = code;
    this.throwable = throwable;
  }
}
