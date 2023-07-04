import {
  NetworkException,
  RequestException,
  ServiceException,
} from './exceptions';

// ============================================================================
// Utils
// ============================================================================

type TRequiredKeys<T> = {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

type TIsEmpty<T> = keyof T extends never ? true : false;

export type TOptionalIfNoRequired<T> = TIsEmpty<TRequiredKeys<T>> extends true
  ? T | undefined
  : T;

// Find first match of multiple keys
export type TFilterKeys<Obj, Matchers> = {
  [K in keyof Obj]: K extends Matchers ? Obj[K] : never;
}[keyof Obj];

// Base path item object structure
export type TPathItemObject = {
  [GHttpMethod in THttpMethod]: {
    parameters: any;
    requestBody: any;
    response: any;
  };
} & { parameters?: any };

// Get a union of paths which have http method
export type TPathsWith<
  GPaths extends Record<string, TPathItemObject>,
  GPathnameMethod extends THttpMethod
> = {
  [GPathname in keyof GPaths]: GPaths[GPathname] extends {
    [K in GPathnameMethod]: any;
  }
    ? GPathname
    : never;
}[keyof GPaths];

// ============================================================================
// Base
// ============================================================================

export type TParseAs = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'stream';
export type THttpMethod =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';
export type TOkStatus = 200 | 201 | 202 | 203 | 204 | 206 | 207;
export type TErrorStatus =
  | 500
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 420
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 429
  | 431
  | 444
  | 450
  | 451
  | 497
  | 498
  | 499
  | 'default';

// Http media type structure (e.g. 'application/json')
export type TMediaType = `${string}/${string}`;

// ============================================================================
// Request parameters
// ============================================================================

export type TRequestPathParams<T> = T extends { parameters: { path?: any } }
  ? NonNullable<T['parameters']['path']>
  : undefined;

export type TRequestQueryParams<T> = T extends { parameters: { query?: any } }
  ? NonNullable<T['parameters']['query']>
  : undefined;

// ============================================================================
// Request body
// ============================================================================

export type TRequestBodyObject<T> = T extends { requestBody?: any }
  ? T['requestBody']
  : undefined;

export type TRequestBodyContent<T> = undefined extends TRequestBodyObject<T>
  ? TFilterKeys<NonNullable<TRequestBodyObject<T>>, 'content'> | undefined
  : TFilterKeys<TRequestBodyObject<T>, 'content'>;

export type TRequestBody<T> = TFilterKeys<
  TRequestBodyContent<T>,
  TMediaType
> extends never
  ? TFilterKeys<NonNullable<TRequestBodyContent<T>>, TMediaType> | undefined
  : TFilterKeys<TRequestBodyContent<T>, TMediaType>;

// ============================================================================
// Response body
// ============================================================================

export type TSuccessResponseContent<T> = TFilterKeys<
  TFilterKeys<T, TOkStatus>,
  'content'
>;

export type TErrorResponseContent<T> = TFilterKeys<
  TFilterKeys<T, TErrorStatus>,
  'content'
>;

export type TSuccessResponseBody<T> = T extends { responses: any }
  ? NonNullable<
      TFilterKeys<TSuccessResponseContent<T['responses']>, TMediaType>
    >
  : unknown;

export type TErrorResponseBody<T> = T extends { responses: any }
  ? NonNullable<TFilterKeys<TErrorResponseContent<T['responses']>, TMediaType>>
  : unknown;

export type TResponseBody<T> = TSuccessResponseBody<T>; // No ErrorResponse as errors are handled via Exceptions

// ============================================================================
// Serializer methods
// ============================================================================

export type TQuerySerializer<T> = (query: TRequestQueryParams<T>) => string;

export type TBodySerializer<T> = (body: TRequestBody<T>) => any;

// ============================================================================
// Middleware
// ============================================================================

export type TRequestMiddleware = (
  init: RequestInit,
  props: Record<string, any>
) => Promise<RequestInit>;

// ============================================================================
// Fetch options
// ============================================================================

export type TFetchOptionsQueryParamsPart<T> =
  undefined extends TRequestQueryParams<T>
    ? { queryParams?: Record<string, any> }
    : { queryParams: TRequestQueryParams<T> & Record<string, any> };

export type TFetchOptionsPathParamsPart<T> =
  undefined extends TRequestPathParams<T>
    ? { pathParams?: Record<string, any> }
    : { pathParams: TRequestPathParams<T> & Record<string, any> };

export type TFetchOptionsBodyPart<T> = undefined extends TRequestBody<T>
  ? { body?: TRequestBody<T> & Record<string, any> }
  : { body: TRequestBody<T> & Record<string, any> };

export type TFetchOptionsBase<T> = {
  querySerializer?: TQuerySerializer<T>;
  bodySerializer?: TBodySerializer<T>;
  parseAs?: TParseAs;
  headers?: RequestInit['headers'];
  rootFetchProps?: Omit<RequestInit, 'body' | 'headers' | 'method'>;
  middlewareProps?: Record<string, any>;
};

export type TFetchOptions<T> = TFetchOptionsBase<T> &
  TFetchOptionsQueryParamsPart<T> &
  TFetchOptionsPathParamsPart<T>;
export type TFetchOptionsWithBody<T> = TFetchOptions<T> &
  TFetchOptionsBodyPart<T>;

// ============================================================================
// Fetch response
// ============================================================================

export type TFetchResponseSuccess<T> = {
  isError: false;
  data: TResponseBody<T>;
  response: Response;
};
export type TFetchResponseError<T> = {
  isError: true;
  error: NetworkException | RequestException<T> | ServiceException;
  response: Response | null;
};
export type TFetchResponse<T> =
  | TFetchResponseSuccess<T>
  | TFetchResponseError<T>;

// ============================================================================
// OpenAPIFetchClient options
// ============================================================================

export type TOpenAPIFetchClientOptions<T> = {
  requestMiddleware?: TRequestMiddleware | TRequestMiddleware[];
  querySerializer?: TQuerySerializer<T>;
  bodySerializer?: TBodySerializer<T>;
  rootFetchProps?: Omit<RequestInit, 'body' | 'method'>;
};
