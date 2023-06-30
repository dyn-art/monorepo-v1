export class NetworkException extends Error {
  public readonly code: string;
  public readonly description?: string;
  public readonly throwable?: Error;

  constructor(
    code: string,
    options: {
      description?: string;
      throwable?: Error;
    }
  ) {
    const { throwable, description } = options;
    super(
      `Call to endpoint failed with network error ${code}${
        description != null ? `: ${description}` : '!'
      }`
    );
    this.code = code;
    this.description = description;
    this.throwable = throwable;
  }
}
