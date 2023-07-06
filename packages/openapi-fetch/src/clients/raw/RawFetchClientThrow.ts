import {
  TFetchOptions,
  TFetchOptionsWithBody,
  TOpenAPIFetchClientOptions,
} from '../../types';
import { RawFetchClient } from './RawFetchClient';

export class RawFetchClientThrow extends RawFetchClient {
  constructor(baseUrl?: string, options: TOpenAPIFetchClientOptions<any> = {}) {
    super(baseUrl, options);
  }

  // ============================================================================
  // Requests
  // ============================================================================

  public async getThrow<TResponseBody = any>(
    pathOrUrl: string,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(
      pathOrUrl,
      'GET',
      options as TFetchOptions<any>
    );
  }

  public async putThrow<TResponseBody = any, TRequestBody = any>(
    pathOrUrl: string,
    body: TRequestBody,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(pathOrUrl, 'PUT', {
      ...options,
      body: body as any,
    });
  }

  public async postThrow<TResponseBody = any, TBody = any>(
    pathOrUrl: string,
    body: TBody,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(pathOrUrl, 'POST', {
      ...options,
      body: body as any,
    });
  }

  public async delThrow<TResponseBody = any>(
    pathOrUrl: string,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(
      pathOrUrl,
      'DELETE',
      options as TFetchOptions<any>
    );
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public async rawFetchThrow<TResponseBody = any>(
    pathOrUrl: string,
    method: RequestInit['method'],
    options: TFetchOptionsWithBody<any>
  ): Promise<TResponseBody> {
    const response = await super.rawFetch(pathOrUrl, method, options);
    if (response.isError) {
      throw response.error;
    } else {
      return response.data as TResponseBody;
    }
  }
}
