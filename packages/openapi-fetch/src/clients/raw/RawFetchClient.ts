import {
  NetworkException,
  RequestException,
  ServiceException,
} from '../../exceptions';
import {
  TFetchOptions,
  TFetchOptionsWithBody,
  TOpenAPIFetchClientOptions,
} from '../../types';
import { OpenAPIFetchClientBase } from '../openapi/OpenAPIFetchClientBase';

// Raw fetch client that wraps around the OpenAPI fetch client to overwrite its type in a "dirty" manner
// so that it can be used for requests that are not represented by an OpenAPI documentation like fetching json data from S3 bucket, ..
export class RawFetchClient extends OpenAPIFetchClientBase<any> {
  constructor(baseUrl?: string, options: TOpenAPIFetchClientOptions<any> = {}) {
    super(baseUrl ?? '', options);
  }

  // ============================================================================
  // Requests
  // ============================================================================

  public async get<TResponseBody = any, TResponseErrorBody = any>(
    url: string,
    options: TFetchOptions<any> = {}
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return this.rawFetch<TResponseBody, TResponseErrorBody>(
      url,
      'GET',
      options as TFetchOptions<any>
    );
  }

  public async put<
    TResponseBody = any,
    TRequestBody = any,
    TResponseErrorBody = any
  >(
    url: string,
    body: TRequestBody,
    options: TFetchOptions<any> = {}
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return this.rawFetch<TResponseBody, TResponseErrorBody>(url, 'PUT', {
      ...options,
      body: body as any,
    });
  }

  public async post<TResponseBody = any, TBody = any, TResponseErrorBody = any>(
    url: string,
    body: TBody,
    options: TFetchOptions<any> = {}
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return this.rawFetch<TResponseBody, TResponseErrorBody>(url, 'POST', {
      ...options,
      body: body as any,
    });
  }

  public async del<TResponseBody = any, TResponseErrorBody = any>(
    url: string,
    options: TFetchOptions<any> = {}
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return this.rawFetch<TResponseBody, TResponseErrorBody>(
      url,
      'DELETE',
      options as TFetchOptions<any>
    );
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public async rawFetch<TResponseBody = any, TResponseErrorBody = any>(
    path: string,
    method: RequestInit['method'],
    options: TFetchOptionsWithBody<any>
  ): Promise<TRawFetchResponse<TResponseBody, TResponseErrorBody>> {
    return (await super.fetch(path, method, options)) as TRawFetchResponse<
      TResponseBody,
      TResponseErrorBody
    >;
  }
}

export type TRawFetchResponseSuccess<TResponseBody = any> = {
  isError: false;
  data: TResponseBody;
  raw: Response;
};
export type TRawFetchResponseError<TResponseErrorBody = any> = {
  isError: true;
  error:
    | NetworkException
    | RequestException<TResponseErrorBody>
    | ServiceException;
  raw: Response | null;
};
export type TRawFetchResponse<TResponseBody = any, TResponseErrorBody = any> =
  | TRawFetchResponseSuccess<TResponseBody>
  | TRawFetchResponseError<TResponseErrorBody>;
