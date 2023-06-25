export class AppError extends Error {
  // Http status code
  public readonly statusCode: number;
  // Uri that points to a site describing the error in more detail
  public readonly uri: string | null;
  // More detailed error description
  public readonly description: string | null;
  // Additional error information
  public readonly additionalErrors: Array<any>;

  constructor(
    statusCode: number,
    message?: string,
    options: TErrorOptions = {}
  ) {
    super(message);
    const { additionalErrors = [], description = null, uri = null } = options;

    // Set the prototype explicity
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = Error.name;
    this.statusCode = statusCode;
    this.uri = uri;
    this.description = description;
    this.additionalErrors = additionalErrors;

    // https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance
    Error.captureStackTrace(this);
  }
}

type TErrorOptions = {
  uri?: string;
  description?: string;
  additionalErrors?: Array<any>;
};
