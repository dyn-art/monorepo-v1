import 'cross-fetch';
import {
  TFetchOptions,
  TFilterKeys,
  TOpenAPIFetchClientOptions,
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

  public async get<GGetPaths extends TPathsWith<GPaths, 'get'>>(
    path: GGetPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<TFilterKeys<GPaths[GGetPaths], 'get'>>
  ) {
    return this.fetch<GGetPaths, 'get'>(
      path as GGetPaths,
      'GET',
      options as any
    );
  }

  public async put<GPutPaths extends TPathsWith<GPaths, 'put'>>(
    path: GPutPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    body: TRequestBodyFilteredNever<
      'put' extends keyof GPaths[GPutPaths] ? GPaths[GPutPaths]['put'] : unknown
    >,
    options?: TFetchOptions<TFilterKeys<GPaths[GPutPaths], 'put'>>
  ) {
    return this.fetch<GPutPaths, 'put'>(path as GPutPaths, 'PUT', {
      ...(options ?? {}),
      body,
    } as any);
  }

  public async post<GPostPaths extends TPathsWith<GPaths, 'post'>>(
    path: GPostPaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    body: TRequestBodyFilteredNever<
      'post' extends keyof GPaths[GPostPaths]
        ? GPaths[GPostPaths]['post']
        : unknown
    >,
    options?: TFetchOptions<TFilterKeys<GPaths[GPostPaths], 'post'>>
  ) {
    return this.fetch<GPostPaths, 'post'>(path as GPostPaths, 'POST', {
      ...(options ?? {}),
      body,
    } as any);
  }

  public async del<GDeletePaths extends TPathsWith<GPaths, 'delete'>>(
    path: GDeletePaths | (string & Record<never, never>), // https://github.com/microsoft/TypeScript/issues/29729
    options?: TFetchOptions<TFilterKeys<GPaths[GDeletePaths], 'delete'>>
  ) {
    return this.fetch<GDeletePaths, 'delete'>(
      path as GDeletePaths,
      'DELETE',
      options as any
    );
  }
}
