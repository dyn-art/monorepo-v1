import 'cross-fetch';
import {
  BodySerializer,
  FetchOptions,
  FilterKeys,
  HttpMethod,
  MediaType,
  PathsWith,
  QuerySerializer,
  Success,
  createFinalURL,
  defaultBodySerializer,
  defaultQuerySerializer,
} from 'openapi-fetch';
import {
  NetworkException,
  RequestException,
  ServiceException,
} from '../exceptions';
import { fetchWithRetries } from './fetch-with-retries';
import { mapCatchToNetworkException } from './map-catch-to-network-exception';
import { mapResponseToRequestException } from './map-response-to-request-exception';

export class RequestClient<Paths extends {}> {
  private static readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  private readonly _baseUrl: string;
  private readonly _requestMiddlewares: TRequestMiddleware[];

  private readonly _defaultRequestInit: RequestInit;
  private readonly _defaultQuerySerializer: QuerySerializer<unknown>;
  private readonly _defaultBodySerializer: BodySerializer<unknown>;
  private readonly _defaultHeaders: Headers;

  constructor(baseUrl: string, options: TRequestClientOptions = {}) {
    const {
      querySerializer = defaultQuerySerializer,
      bodySerializer = defaultBodySerializer,
      baseRequestInit = {},
      requestMiddleware = [],
    } = options;
    this._baseUrl = baseUrl;
    this._defaultQuerySerializer = querySerializer;
    this._defaultBodySerializer = bodySerializer;
    this._defaultRequestInit = baseRequestInit;
    this._defaultHeaders = new Headers({
      ...RequestClient.DEFAULT_HEADERS,
      ...baseRequestInit.headers,
    });
    this._requestMiddlewares = Array.isArray(requestMiddleware)
      ? requestMiddleware
      : [requestMiddleware];
  }

  // ============================================================================
  // Requests
  // ============================================================================

  public async get<P extends PathsWith<Paths, 'get'>>(
    url: P,
    init: TFetchOptions<FilterKeys<Paths[P], 'get'>>
  ) {
    return this.fetch<P, 'get'>(url, { ...init, method: 'GET' } as any);
  }

  public async put<P extends PathsWith<Paths, 'put'>>(
    url: P,
    init: TFetchOptions<FilterKeys<Paths[P], 'put'>>
  ) {
    return this.fetch<P, 'put'>(url, { ...init, method: 'PUT' } as any);
  }

  public async post<P extends PathsWith<Paths, 'post'>>(
    url: P,
    init: TFetchOptions<FilterKeys<Paths[P], 'post'>>
  ) {
    return this.fetch<P, 'post'>(url, { ...init, method: 'POST' } as any);
  }

  public async del<P extends PathsWith<Paths, 'delete'>>(
    url: P,
    init: TFetchOptions<FilterKeys<Paths[P], 'delete'>>
  ) {
    return this.fetch<P, 'delete'>(url, { ...init, method: 'DELETE' } as any);
  }

  // ============================================================================
  // Helper
  // ============================================================================

  private async fetch<
    TPathKeys extends keyof Paths,
    THttpMethod extends HttpMethod,
    T extends THttpMethodContent<
      Paths,
      THttpMethod,
      TPathKeys
    > = THttpMethodContent<Paths, THttpMethod, TPathKeys>
  >(url: TPathKeys, options: TFetchOptions<T>): Promise<TFetchResponse<T>> {
    const {
      headers = {},
      body: requestBody,
      params = {},
      parseAs = 'json',
      bodySerializer = this._defaultBodySerializer,
      querySerializer = this._defaultQuerySerializer,
      middlewareProps = {},
      ...baseRequestInit
    } = options;

    // Build final URL
    const finalURL = createFinalURL(url as string, {
      baseUrl: this._baseUrl,
      params,
      querySerializer,
    });

    // Build request init object
    let requestInit: RequestInit = {
      redirect: 'follow',
      ...this._defaultRequestInit,
      ...baseRequestInit,
      headers: this.applyDefaultHeaders(headers),
      body:
        requestBody != null ? bodySerializer(requestBody as any) : undefined,
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
      response = await fetchWithRetries(finalURL, { requestInit });
    } catch (error) {
      return this.mapNetworkException<T>(error);
    }

    // Handle ok response (parse as "parseAs" and falling back to .text() when necessary)
    if (response.ok) {
      let data: any = response.body;
      if (parseAs !== 'stream') {
        const cloned = response.clone();
        data =
          typeof cloned[parseAs] === 'function'
            ? await cloned[parseAs]()
            : await cloned.text();
      }
      return { isError: false, data, response };
    }

    // Handle errors (always parse as .json() or .text())
    else {
      return this.mapResponseException<T>(response);
    }
  }

  private applyDefaultHeaders(headers: HeadersInit = {}): Headers {
    const finalHeaders = new Headers(this._defaultHeaders);
    const inputHeaders = new Headers(headers);
    inputHeaders.forEach((value, key) => {
      // Allow `undefined` | `null` to erase default header
      if (value == null) {
        finalHeaders.delete(key);
      } else {
        finalHeaders.set(key, value);
      }
    });
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

  private mapMiddlewareException<T>(error: unknown): TErrorFetchResponse<T> {
    if (error instanceof ServiceException) {
      return {
        isError: true,
        error,
        response: null,
      };
    } else if (error instanceof Error) {
      return {
        isError: true,
        error: new ServiceException('#ERR_MIDDLEWARE', {
          description: error.message,
        }),
        response: null,
      };
    } else {
      return {
        isError: true,
        error: new ServiceException('#ERR_MIDDLEWARE'),
        response: null,
      };
    }
  }

  private async mapResponseException<T>(
    response: Response
  ): Promise<TErrorFetchResponse<T>> {
    const requestException = await mapResponseToRequestException(
      response,
      '#ERR_UNKOWN'
    );
    return {
      isError: true,
      error: requestException,
      response,
    };
  }

  private mapNetworkException<T>(error: unknown): TErrorFetchResponse<T> {
    const networkException = mapCatchToNetworkException(error, '#ERR_NETWORK');
    return {
      isError: true,
      error: networkException,
      response: null,
    };
  }
}

type THttpMethodContent<
  Paths extends {},
  THttpMethod extends HttpMethod,
  TPathKeys extends keyof Paths
> = THttpMethod extends keyof Paths[TPathKeys]
  ? Paths[TPathKeys][THttpMethod]
  : unknown;

export type TFetchOptions<T> = FetchOptions<T> & {
  middlewareProps?: Record<string, any>;
};

export type TRequestClientOptions = {
  querySerializer?: QuerySerializer<unknown>;
  bodySerializer?: BodySerializer<unknown>;
  baseRequestInit?: RequestInit;
  requestMiddleware?: TRequestMiddleware | TRequestMiddleware[];
};

export type TRequestMiddleware = (
  init: RequestInit,
  props: Record<string, any>
) => Promise<RequestInit>;

export type TFetchResponse<T> =
  | TSuccessFetchResponse<T>
  | TErrorFetchResponse<T>;

export type TSuccessFetchResponse<T> = {
  isError: false;
  data: T extends { responses: any }
    ? NonNullable<FilterKeys<Success<T['responses']>, MediaType>>
    : unknown;
  response: Response;
};

export type TErrorFetchResponse<T> = {
  isError: true;
  error: NetworkException | RequestException<T> | ServiceException;
  response: Response | null;
};
