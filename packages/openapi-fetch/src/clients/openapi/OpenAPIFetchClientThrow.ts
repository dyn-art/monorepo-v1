import {
  TFetchOptions,
  TFetchOptionsWithBody,
  TFilterKeys,
  THttpMethod,
  TOpenAPIFetchClientOptions,
  TPathsWith,
  TRequestBodyFilteredNever,
  TResponseBody,
} from '../../types';
import { OpenAPIFetchClient } from './OpenAPIFetchClient';

export class OpenAPIFetchClientThrow<
  GPaths extends {} = {}
> extends OpenAPIFetchClient<GPaths> {
  constructor(
    baseUrl: string,
    options: TOpenAPIFetchClientOptions<GPaths> = {}
  ) {
    super(baseUrl, options);
  }

  // ============================================================================
  // Requests
  // ============================================================================

  public async getThrow<GGetPaths extends TPathsWith<GPaths, 'get'>>(
    path: GGetPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<TFilterKeys<GPaths[GGetPaths], 'get'>>
  ) {
    return this.fetchThrow<GGetPaths, 'get'>(
      path as GGetPaths,
      'GET',
      options as any
    );
  }

  public async putThrow<GPutPaths extends TPathsWith<GPaths, 'put'>>(
    path: GPutPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    body: TRequestBodyFilteredNever<
      'put' extends keyof GPaths[GPutPaths] ? GPaths[GPutPaths]['put'] : unknown
    >,
    options?: TFetchOptions<TFilterKeys<GPaths[GPutPaths], 'put'>>
  ) {
    return this.fetchThrow<GPutPaths, 'put'>(path as GPutPaths, 'PUT', {
      ...(options ?? {}),
      body,
    } as any);
  }

  public async postThrow<GPostPaths extends TPathsWith<GPaths, 'post'>>(
    path: GPostPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    body: TRequestBodyFilteredNever<
      'post' extends keyof GPaths[GPostPaths]
        ? GPaths[GPostPaths]['post']
        : unknown
    >,
    options?: TFetchOptions<TFilterKeys<GPaths[GPostPaths], 'post'>>
  ) {
    return this.fetchThrow<GPostPaths, 'post'>(path as GPostPaths, 'POST', {
      ...(options ?? {}),
      body,
    } as any);
  }

  public async delThrow<GDeletePaths extends TPathsWith<GPaths, 'delete'>>(
    path: GDeletePaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<TFilterKeys<GPaths[GDeletePaths], 'delete'>>
  ) {
    return this.fetchThrow<GDeletePaths, 'delete'>(
      path as GDeletePaths,
      'DELETE',
      options as any
    );
  }

  // ============================================================================
  // Helper
  // ============================================================================

  public async fetchThrow<
    GPathKeys extends keyof GPaths,
    GHttpMethod extends THttpMethod,
    GPathMethod extends GHttpMethod extends keyof GPaths[GPathKeys]
      ? GPaths[GPathKeys][GHttpMethod]
      : unknown = GHttpMethod extends keyof GPaths[GPathKeys]
      ? GPaths[GPathKeys][GHttpMethod]
      : unknown
  >(
    path: GPathKeys | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    method: RequestInit['method'],
    options?: TFetchOptionsWithBody<
      GHttpMethod extends keyof GPaths[GPathKeys]
        ? GPaths[GPathKeys][GHttpMethod]
        : never
    >
  ): Promise<TResponseBody<GPathMethod>> {
    const response = await super.fetch(path, method, options);
    if (response.isError) {
      throw response.error;
    } else {
      return response.data;
    }
  }
}
