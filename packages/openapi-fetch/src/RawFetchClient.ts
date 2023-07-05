import { OpenAPIFetchClient } from './OpenAPIFetchClient';
import {
  NetworkException,
  RequestException,
  ServiceException,
} from './exceptions';
import { TFetchOptions, TOpenAPIFetchClientOptions } from './types';

// Raw fetch client that wraps around the OpenAPI fetch client to overwrite its type in a "dirty" manner
// so that it can be used for requests that are not represented by an OpenAPI documentation like fetching json data from S3 bucket, ..
export class RawFetchClient extends OpenAPIFetchClient<any> {
  constructor(baseUrl?: string, options: TOpenAPIFetchClientOptions<any> = {}) {
    super(baseUrl ?? '', options);
  }

  public async get<TResponseBody = any, TResponseErrorBody = any>(
    url: string,
    options?: TFetchOptions<any>
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return (await this.fetch<any, any>(
      url,
      'GET',
      options
    )) as TRawFetchResponse<TResponseBody, TResponseErrorBody>;
  }

  public async put<
    TResponseBody = any,
    TRequestBody = any,
    TResponseErrorBody = any
  >(
    url: string,
    body: TRequestBody,
    options?: TFetchOptions<any>
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return (await this.fetch<any, any>(url, 'PUT', {
      ...(options ?? {}),
      body: body as any,
    })) as TRawFetchResponse<TResponseBody, TResponseErrorBody>;
  }

  public async post<TResponseBody = any, TBody = any, TResponseErrorBody = any>(
    url: string,
    body: TBody,
    options?: TFetchOptions<any>
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return (await this.fetch<any, any>(url, 'POST', {
      ...(options ?? {}),
      body: body as any,
    })) as TRawFetchResponse<TResponseBody, TResponseErrorBody>;
  }

  public async del<TResponseBody = any, TResponseErrorBody = any>(
    url: string,
    options?: TFetchOptions<any>
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return (await this.fetch<any, any>(
      url,
      'DELETE',
      options
    )) as TRawFetchResponse<TResponseBody, TResponseErrorBody>;
  }
}

export type TRawFetchResponseSuccess<TResponseBody = any> = {
  isError: false;
  data: TResponseBody;
  response: Response;
};
export type TRawFetchResponseError<TResponseErrorBody = any> = {
  isError: true;
  error:
    | NetworkException
    | RequestException<TResponseErrorBody>
    | ServiceException;
  response: Response | null;
};
export type TRawFetchResponse<TResponseBody = any, TResponseErrorBody = any> =
  | TRawFetchResponseSuccess<TResponseBody>
  | TRawFetchResponseError<TResponseErrorBody>;
