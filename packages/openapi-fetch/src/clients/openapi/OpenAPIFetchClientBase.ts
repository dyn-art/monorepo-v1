import { ServiceException } from '../../exceptions';
import {
  TBodySerializer,
  TFetchOptionsWithBody,
  TFetchResponse,
  TFetchResponseError,
  THttpMethod,
  TOpenAPIFetchClientOptions,
  TQuerySerializer,
  TRequestMiddleware,
} from '../../types';
import {
  buildURI,
  defaultBodySerializer,
  fetchWithRetries,
  mapCatchToNetworkException,
  mapResponseToRequestException,
  parseAndValidateURL,
  serializeQueryParams,
} from '../../utils';

export class OpenAPIFetchClientBase<GPaths extends {} = {}> {
  private static readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  protected readonly _baseUrl: string;
  protected readonly _requestMiddlewares: TRequestMiddleware[];

  protected readonly _defaultHeaders: Record<string, string>;
  protected readonly _defaultFetchProps: Omit<
    RequestInit,
    'method' | 'headers' | 'body'
  >;
  protected readonly _defaultQuerySerializer: TQuerySerializer<unknown>;
  protected readonly _defaultBodySerializer: TBodySerializer<unknown>;

  constructor(
    baseUrl: string,
    options: TOpenAPIFetchClientOptions<GPaths> = {}
  ) {
    const {
      querySerializer = serializeQueryParams,
      bodySerializer = defaultBodySerializer,
      rootFetchProps = {},
      requestMiddleware = [],
    } = options;
    this._baseUrl = baseUrl;
    this._defaultQuerySerializer = querySerializer;
    this._defaultBodySerializer = bodySerializer;
    this._defaultFetchProps = rootFetchProps;
    this._defaultHeaders = {
      ...OpenAPIFetchClientBase.DEFAULT_HEADERS,
    };
    if ('headers' in rootFetchProps) {
      this._defaultHeaders = {
        ...this._defaultHeaders,
        ...(rootFetchProps.headers as Record<string, string>),
      };
      delete this._defaultFetchProps['headers']; // Remove headers as they are present in _defaultHeaders
    }
    this._requestMiddlewares = Array.isArray(requestMiddleware)
      ? requestMiddleware
      : [requestMiddleware];
  }

  public async fetch<
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
  ): Promise<TFetchResponse<GPathMethod>> {
    const {
      headers = {},
      parseAs = 'json',
      bodySerializer = this._defaultBodySerializer,
      querySerializer = this._defaultQuerySerializer,
      pathParams = null,
      queryParams = null,
      rootFetchProps = {},
      middlewareProps = {},
      body = undefined,
      baseUrl = this._baseUrl,
    } = options ?? {};

    // Parse and validate URL to ensure that even if path is a full URL and baseUrl is an empty string,
    // the finalPath and origin can still be correctly extracted
    const { path: parsedPath, origin } = parseAndValidateURL(
      `${baseUrl}${path as string}`,
      queryParams == null
    );

    // Build final URL
    const finalURL = buildURI(origin, {
      path: parsedPath,
      params: {
        path: pathParams,
        query: queryParams,
      },
      querySerializer,
    });

    // Build request init object
    let requestInit: RequestInit = {
      redirect: 'follow',
      ...this._defaultFetchProps,
      ...rootFetchProps,
      method,
      headers: this.applyDefaultHeaders(headers),
      body:
        body != null
          ? bodySerializer(body as any, headers['Content-Type'])
          : undefined,
    };

    // Call middlewares
    try {
      requestInit = await this.processRequestMiddlewares(
        this._requestMiddlewares,
        requestInit,
        middlewareProps
      );
    } catch (error) {
      return this.mapMiddlewareException(error);
    }

    // Send request
    let response: Response;
    try {
      response = await fetchWithRetries(finalURL, {
        requestInit,
      });
    } catch (error) {
      return this.mapNetworkException<GPathMethod>(error);
    }

    // Handle ok response (parse as "parseAs" and falling back to .text() when necessary)
    if (response.ok) {
      let data: unknown = response.body;
      if (parseAs !== 'stream') {
        const cloned = // Clone method not supported by Figma sandbox environment
          typeof response.clone === 'function' ? response.clone() : response;
        data =
          typeof cloned[parseAs] === 'function'
            ? await cloned[parseAs]()
            : await cloned.text();
      }
      return { isError: false, data: data as any, raw: response };
    }

    // Handle errors (always parse as .json() or .text())
    else {
      return this.mapResponseException<GPathMethod>(response);
    }
  }

  private applyDefaultHeaders(
    headers: Record<string, string> = {}
  ): Record<string, string> {
    const finalHeaders = { ...this._defaultHeaders };
    for (const key in headers) {
      // Allow `undefined` | `null` to erase default header
      if (headers[key] == null) {
        delete finalHeaders[key];
      } else {
        finalHeaders[key] = headers[key];
      }
    }
    return finalHeaders;
  }

  private async processRequestMiddlewares(
    middlewares: TRequestMiddleware[],
    init: RequestInit,
    middlewareProps: Record<string, any> = {}
  ) {
    let result = init;
    for (const middleware of middlewares) {
      result = await middleware(result, middlewareProps);
    }
    return result;
  }

  // ============================================================================
  // Error Mapping
  // ============================================================================

  private mapMiddlewareException<T>(error: unknown): TFetchResponseError<T> {
    if (error instanceof ServiceException) {
      return {
        isError: true,
        error,
        raw: null,
      };
    } else if (error instanceof Error) {
      return {
        isError: true,
        error: new ServiceException('#ERR_MIDDLEWARE', {
          description: error.message,
        }),
        raw: null,
      };
    } else {
      return {
        isError: true,
        error: new ServiceException('#ERR_MIDDLEWARE'),
        raw: null,
      };
    }
  }

  private async mapResponseException<T>(
    response: Response
  ): Promise<TFetchResponseError<T>> {
    const requestException = await mapResponseToRequestException(
      response,
      '#ERR_UNKNOWN'
    );
    return {
      isError: true,
      error: requestException,
      raw: response,
    };
  }

  private mapNetworkException<T>(error: unknown): TFetchResponseError<T> {
    const networkException = mapCatchToNetworkException(error, '#ERR_NETWORK');
    return {
      isError: true,
      error: networkException,
      raw: null,
    };
  }
}
