import { ServiceException } from './ServiceException';

export class RequestException<TData = any> extends ServiceException {
  public readonly status: number;
  public readonly response?: Response;
  public readonly data?: TData;

  constructor(
    code: string,
    status: number,
    options: {
      description?: string;
      data?: TData;
      response?: Response;
    } = {}
  ) {
    const { description, response, data } = options;
    super(code, {
      description,
      message: `Call to endpoint failed with status ${status} and error code ${code}${
        description != null ? `: ${description}` : '!'
      }`,
    });
    this.status = status;
    this.response = response;
    this.data = data;
  }
}
