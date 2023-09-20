import {
  NetworkException,
  RequestException,
  ServiceException,
} from '../../exceptions';
import {
  TFetchOptions,
  TFetchOptionsWithBody,
  TOpenAPIFetchClientOptions,
  TParseAs,
  TResponseBodyWithParseAs,
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

  public async get<
    TResponseBody = any,
    TResponseErrorBody = any,
    GParseAs extends TParseAs = 'json'
  >(pathOrUrl: string, options: TFetchOptions<any, GParseAs> = {}) {
    return this.rawFetch<TResponseBody, TResponseErrorBody, GParseAs>(
      pathOrUrl,
      'GET',
      options
    );
  }

  public async put<
    TResponseBody = any,
    TRequestBody = any,
    TResponseErrorBody = any,
    GParseAs extends TParseAs = 'json'
  >(
    pathOrUrl: string,
    body: TRequestBody,
    options: TFetchOptions<any, GParseAs> = {}
  ) {
    return this.rawFetch<TResponseBody, TResponseErrorBody, GParseAs>(
      pathOrUrl,
      'PUT',
      {
        ...options,
        body: body as any,
      }
    );
  }

  public async post<
    TResponseBody = any,
    TBody = any,
    TResponseErrorBody = any,
    GParseAs extends TParseAs = 'json'
  >(
    pathOrUrl: string,
    body: TBody,
    options: TFetchOptions<any, GParseAs> = {}
  ) {
    return this.rawFetch<TResponseBody, TResponseErrorBody, GParseAs>(
      pathOrUrl,
      'POST',
      {
        ...options,
        body: body as any,
      }
    );
  }

  public async del<
    TResponseBody = any,
    TResponseErrorBody = any,
    GParseAs extends TParseAs = 'json'
  >(pathOrUrl: string, options: TFetchOptions<any, GParseAs> = {}) {
    return this.rawFetch<TResponseBody, TResponseErrorBody, GParseAs>(
      pathOrUrl,
      'DELETE',
      options
    );
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public async rawFetch<
    TResponseBody = any,
    TResponseErrorBody = any,
    GParseAs extends TParseAs = 'json'
  >(
    pathOrUrl: string,
    method: RequestInit['method'],
    options: TFetchOptionsWithBody<any, GParseAs>
  ): Promise<
    TRawFetchResponse<
      TResponseBodyWithParseAs<TResponseBody>,
      TResponseErrorBody,
      GParseAs
    >
  > {
    return (await super.fetch(pathOrUrl, method, options)) as TRawFetchResponse<
      TResponseBody,
      TResponseErrorBody,
      GParseAs
    >;
  }
}

export type TRawFetchResponseSuccess<
  GResponseBody,
  GParseAs extends TParseAs
> = {
  isError: false;
  data: TResponseBodyWithParseAs<GResponseBody, GParseAs>;
  raw: Response;
};
export type TRawFetchResponseError<GResponseErrorBody> = {
  isError: true;
  error:
    | NetworkException
    | RequestException<GResponseErrorBody>
    | ServiceException;
  raw: Response | null;
};
export type TRawFetchResponse<
  GResponseBody,
  GResponseErrorBody,
  GParseAs extends TParseAs
> =
  | TRawFetchResponseSuccess<GResponseBody, GParseAs>
  | TRawFetchResponseError<GResponseErrorBody>;
