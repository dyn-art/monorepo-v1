export class RequestException extends Error {
  public readonly status?: number | string;
  public readonly throwable?: Error;

  constructor(args: { message: string; status?: number; throwable?: Error }) {
    const { message, status, throwable } = args;
    super(
      `Call to endpoint failed${
        status ? ` with status '${status}'` : ''
      }: ${message}`
    );
    this.status = status;
    this.throwable = throwable;
  }
}
