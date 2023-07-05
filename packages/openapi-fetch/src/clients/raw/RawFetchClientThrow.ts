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
    url: string,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(
      url,
      'GET',
      options as TFetchOptions<any>
    );
  }

  public async putThrow<TResponseBody = any, TRequestBody = any>(
    url: string,
    body: TRequestBody,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(url, 'PUT', {
      ...options,
      body: body as any,
    });
  }

  public async postThrow<TResponseBody = any, TBody = any>(
    url: string,
    body: TBody,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(url, 'POST', {
      ...options,
      body: body as any,
    });
  }

  public async delThrow<TResponseBody = any>(
    url: string,
    options: TFetchOptions<any> = {}
  ): Promise<TResponseBody> {
    return this.rawFetchThrow<TResponseBody>(
      url,
      'DELETE',
      options as TFetchOptions<any>
    );
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public async rawFetchThrow<TResponseBody = any>(
    path: string,
    method: RequestInit['method'],
    options: TFetchOptionsWithBody<any>
  ): Promise<TResponseBody> {
    const response = await super.fetch(path, method, options);
    if (response.isError) {
      throw response.error;
    } else {
      return response.data as TResponseBody;
    }
  }
}
