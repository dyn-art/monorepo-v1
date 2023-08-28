import 'cross-fetch';
import {
  TFetchOptions,
  TFilterKeys,
  TOpenAPIFetchClientOptions,
  TParseAs,
  TPathsWith,
  TRequestBodyFilteredNever,
} from '../../types';
import { OpenAPIFetchClientBase } from './OpenAPIFetchClientBase';

export class OpenAPIFetchClient<
  GPaths extends {} = {}
> extends OpenAPIFetchClientBase<GPaths> {
  constructor(
    baseUrl: string,
    options: TOpenAPIFetchClientOptions<GPaths> = {}
  ) {
    super(baseUrl, options);
  }

  public async get<
    GGetPaths extends TPathsWith<GPaths, 'get'>,
    GParseAs extends TParseAs = 'json'
  >(
    path: GGetPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<TFilterKeys<GPaths[GGetPaths], 'get'>, GParseAs>
  ) {
    return this.fetch<GGetPaths, 'get', GParseAs>(
      path as GGetPaths,
      'GET',
      options as any
    );
  }

  public async put<
    GPutPaths extends TPathsWith<GPaths, 'put'>,
    GParseAs extends TParseAs = 'json'
  >(
    path: GPutPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    body: TRequestBodyFilteredNever<
      'put' extends keyof GPaths[GPutPaths] ? GPaths[GPutPaths]['put'] : unknown
    >,
    options?: TFetchOptions<TFilterKeys<GPaths[GPutPaths], 'put'>, GParseAs>
  ) {
    return this.fetch<GPutPaths, 'put', GParseAs>(path as GPutPaths, 'PUT', {
      ...(options ?? {}),
      body,
    } as any);
  }

  public async post<
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
    return this.fetch<GPostPaths, 'post', GParseAs>(
      path as GPostPaths,
      'POST',
      {
        ...(options ?? {}),
        body,
      } as any
    );
  }

  public async del<
    GDeletePaths extends TPathsWith<GPaths, 'delete'>,
    GParseAs extends TParseAs = 'json'
  >(
    path: GDeletePaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<
      TFilterKeys<GPaths[GDeletePaths], 'delete'>,
      GParseAs
    >
  ) {
    return this.fetch<GDeletePaths, 'delete', GParseAs>(
      path as GDeletePaths,
      'DELETE',
      options as any
    );
  }
}
