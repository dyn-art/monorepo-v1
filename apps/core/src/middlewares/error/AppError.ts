export class AppError extends Error {
  // HTTP status code that denotes the status of the HTTP request.
  public readonly status: number;
  // A short, unique error code (typically alphanumeric) representing the error.
  // Provides a convenient way for developers to programmatically handle specific error scenarios.
  public readonly code: string;
  // A more detailed, human-readable description of the error,
  // providing additional context and potentially steps to resolve the error.
  public readonly description?: string;
  // Optional URI providing a hyperlink to a document describing the error in more detail.
  // Helps to centralize error information and provide a more detailed context.
  public readonly uri?: string;
  // An array of additional errors that occurred during the request.
  // Useful for capturing and communicating multiple errors in a single response.
  public readonly additionalErrors: Array<Record<string, any>> = [];

  constructor(status: number, code: string, options: TErrorOptions = {}) {
    const { additionalErrors = [], description, uri } = options;
    super(
      `Call to endpoint failed with status ${status} and error code ${code}${
        description != null ? `: ${description}` : '!'
      }`
    );

    // Set the prototype explicity
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.name = Error.name;
    this.status = status;
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
  additionalErrors?: Array<Record<string, any>>;
};
