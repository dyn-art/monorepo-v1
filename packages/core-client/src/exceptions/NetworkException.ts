export class NetworkException extends Error {
  public readonly code: string;
  public readonly description: string;
  public readonly throwable?: Error;

  constructor(
    code: string,
    description: string,
    options: {
      throwable?: Error;
    }
  ) {
    const { throwable } = options;
    super(`${code}: ${description}`);
    this.code = code;
    this.description = description;
    this.throwable = throwable;
  }
}
