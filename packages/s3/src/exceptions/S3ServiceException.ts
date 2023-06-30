export class S3ServiceException extends Error {
  public readonly name: string;
  public readonly route?: string;
  public readonly throwable?: Error;

  constructor(args: {
    message: string;
    name: string;
    throwable?: Error;
    route?: string;
  }) {
    const { message, name, throwable, route } = args;
    super(message);
    this.name = name;
    this.throwable = throwable;
    this.route = route;
  }
}
