import {
  TFetchOptions,
  TFetchOptionsWithBody,
  TFilterKeys,
  THttpMethod,
  TOpenAPIFetchClientOptions,
  TParseAs,
  TPathsWith,
  TRequestBodyFilteredNever,
  TResponseBody,
  TResponseBodyWithParseAs,
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

  public async getThrow<
    GGetPaths extends TPathsWith<GPaths, 'get'>,
    GParseAs extends TParseAs = 'json'
  >(
    path: GGetPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<TFilterKeys<GPaths[GGetPaths], 'get'>, GParseAs>
  ) {
    return this.fetchThrow<GGetPaths, 'get', GParseAs>(
      path as GGetPaths,
      'GET',
      options as any
    );
  }

  public async putThrow<
    GPutPaths extends TPathsWith<GPaths, 'put'>,
    GParseAs extends TParseAs = 'json'
  >(
    path: GPutPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    body: TRequestBodyFilteredNever<
      'put' extends keyof GPaths[GPutPaths] ? GPaths[GPutPaths]['put'] : unknown
    >,
    options?: TFetchOptions<TFilterKeys<GPaths[GPutPaths], 'put'>, GParseAs>
  ) {
    return this.fetchThrow<GPutPaths, 'put', GParseAs>(
      path as GPutPaths,
      'PUT',
      {
        ...(options ?? {}),
        body,
      } as any
    );
  }

  public async postThrow<
    GPostPaths extends TPathsWith<GPaths, 'post'>,
    GParseAs extends TParseAs = 'json'
  >(
    path: GPostPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    body: TRequestBodyFilteredNever<
      'post' extends keyof GPaths[GPostPaths]
        ? GPaths[GPostPaths]['post']
        : unknown
    >,
    options?: TFetchOptions<TFilterKeys<GPaths[GPostPaths], 'post'>, GParseAs>
  ) {
    return this.fetchThrow<GPostPaths, 'post', GParseAs>(
      path as GPostPaths,
      'POST',
      {
        ...(options ?? {}),
        body,
      } as any
    );
  }

  public async delThrow<
    GDeletePaths extends TPathsWith<GPaths, 'delete'>,
    GParseAs extends TParseAs = 'json'
  >(
    path: GDeletePaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<
      TFilterKeys<GPaths[GDeletePaths], 'delete'>,
      GParseAs
    >
  ) {
    return this.fetchThrow<GDeletePaths, 'delete', GParseAs>(
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
    GParseAs extends TParseAs = 'json',
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
        : never,
      GParseAs
    >
  ): Promise<TResponseBodyWithParseAs<TResponseBody<GPathMethod>, GParseAs>> {
    const response = await super.fetch(path, method, options);
    if (response.isError) {
      throw response.error;
    } else {
      return response.data;
    }
  }
}
