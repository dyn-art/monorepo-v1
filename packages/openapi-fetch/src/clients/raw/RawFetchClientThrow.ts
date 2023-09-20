import {
  TFetchOptions,
  TFetchOptionsWithBody,
  TOpenAPIFetchClientOptions,
  TParseAs,
  TResponseBodyWithParseAs,
} from '../../types';
import { RawFetchClient } from './RawFetchClient';

export class RawFetchClientThrow extends RawFetchClient {
  constructor(baseUrl?: string, options: TOpenAPIFetchClientOptions<any> = {}) {
    super(baseUrl, options);
  }

  // ============================================================================
  // Requests
  // ============================================================================

  public async getThrow<
    TResponseBody = any,
    GParseAs extends TParseAs = 'json'
  >(pathOrUrl: string, options: TFetchOptions<any, GParseAs> = {}) {
    return this.rawFetchThrow<TResponseBody, GParseAs>(
      pathOrUrl,
      'GET',
      options
    );
  }

  public async putThrow<
    TResponseBody = any,
    TRequestBody = any,
    GParseAs extends TParseAs = 'json'
  >(
    pathOrUrl: string,
    body: TRequestBody,
    options: TFetchOptions<any, GParseAs> = {}
  ) {
    return this.rawFetchThrow<TResponseBody, GParseAs>(pathOrUrl, 'PUT', {
      ...options,
      body: body as any,
    });
  }

  public async postThrow<
    TResponseBody = any,
    TBody = any,
    GParseAs extends TParseAs = 'json'
  >(
    pathOrUrl: string,
    body: TBody,
    options: TFetchOptions<any, GParseAs> = {}
  ) {
    return this.rawFetchThrow<TResponseBody, GParseAs>(pathOrUrl, 'POST', {
      ...options,
      body: body as any,
    });
  }

  public async delThrow<
    TResponseBody = any,
    GParseAs extends TParseAs = 'json'
  >(pathOrUrl: string, options: TFetchOptions<any, GParseAs> = {}) {
    return this.rawFetchThrow<TResponseBody, GParseAs>(
      pathOrUrl,
      'DELETE',
      options
    );
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public async rawFetchThrow<
    TResponseBody = any,
    GParseAs extends TParseAs = 'json'
  >(
    pathOrUrl: string,
    method: RequestInit['method'],
    options: TFetchOptionsWithBody<any, GParseAs>
  ): Promise<TResponseBodyWithParseAs<TResponseBody>> {
    const response = await super.rawFetch(pathOrUrl, method, options);
    if (response.isError) {
      throw response.error;
    } else {
      return response.data as TResponseBody;
    }
  }
}
