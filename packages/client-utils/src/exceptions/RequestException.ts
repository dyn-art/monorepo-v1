import { Error, FilterKeys, MediaType } from 'openapi-fetch';
import { ServiceException } from './ServiceException';

export class RequestException<T = any> extends ServiceException {
  public readonly status: number;
  public readonly raw?: TRaw<T>;

  constructor(
    code: string,
    status: number,
    options: {
      description?: string;
      raw?: TRaw<T>;
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

type TRaw<T> = T extends { responses: any }
  ? NonNullable<FilterKeys<Error<T['responses']>, MediaType>>
  : unknown;
