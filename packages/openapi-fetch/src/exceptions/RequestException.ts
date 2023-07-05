import { TErrorResponseBody } from '../types';
import { ServiceException } from './ServiceException';

export class RequestException<GPathMethod = any> extends ServiceException {
  public readonly status: number;
  public readonly raw?: TErrorResponseBody<GPathMethod>;

  constructor(
    code: string,
    status: number,
    options: {
      description?: string;
      raw?: TErrorResponseBody<GPathMethod>;
    } = {}
  ) {
    const { description, raw } = options;
    super(code, {
      description,
      message: `Call to endpoint failed with status ${status} and error code ${code}${
        description != null ? `: ${description}` : '!'
      }`,
    });
    this.status = status;
    this.raw = raw;
  }
}
