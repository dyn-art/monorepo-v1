import express from 'express';
import * as core from 'express-serve-static-core';

export type OkStatus = 200 | 201 | 202 | 203 | 204 | 206 | 207;
export type ErrorStatus =
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

// Find first match of multiple keys
export type FilterKeys<Obj, Matchers> = {
  [K in keyof Obj]: K extends Matchers ? Obj[K] : never;
}[keyof Obj];

// Http media type structure (e.g. 'application/json')
export type MediaType = `${string}/${string}`;

export type Success<T> = FilterKeys<FilterKeys<T, OkStatus>, 'content'>;
export type Error<T> = FilterKeys<FilterKeys<T, ErrorStatus>, 'content'>;

// Request Parameters
export type TRequestPathParameters<T> = T extends { parameters: any }
  ? NonNullable<T['parameters']['path']>
  : core.ParamsDictionary;
export type TRequestQueryParameters<T> = T extends { parameters: any }
  ? NonNullable<T['parameters']['query']>
  : core.Query;

// Request Body
export type TRequestBodyObj<T> = T extends { requestBody?: any }
  ? T['requestBody']
  : never;
export type TRequestBodyContent<T> = undefined extends TRequestBodyObj<T>
  ? FilterKeys<NonNullable<TRequestBodyObj<T>>, 'content'> | undefined
  : FilterKeys<TRequestBodyObj<T>, 'content'>;
export type TRequestBody<T> = FilterKeys<
  TRequestBodyContent<T>,
  MediaType
> extends never
  ? FilterKeys<NonNullable<TRequestBodyContent<T>>, MediaType> | undefined
  : FilterKeys<TRequestBodyContent<T>, MediaType>;

// Request Responses
export type TSuccessResponseBody<T> = T extends { responses: any }
  ? NonNullable<FilterKeys<Success<T['responses']>, MediaType>>
  : unknown;
export type TErrorResponseBody<T> = T extends { responses: any }
  ? NonNullable<FilterKeys<Error<T['responses']>, MediaType>>
  : unknown;
export type TResponseBody<T> = TSuccessResponseBody<T>; // No ErrorResponse as errors are handled via Exceptions

export type TOpenAPIRequest<
  TPaths extends {},
  TPath extends keyof TPaths,
  TMethod extends keyof TPaths[TPath]
> = express.Request<
  TRequestPathParameters<TPaths[TPath][TMethod]>, // Params
  TResponseBody<TPaths[TPath][TMethod]>, // ResBody
  TRequestBody<TPaths[TPath][TMethod]>, // ReqBody
  TRequestQueryParameters<TPaths[TPath][TMethod]>, // ReqQuery
  Record<string, any> // Locals
>;

export type TOpenAPIResponse<
  TPaths extends {},
  TPath extends keyof TPaths,
  TMethod extends keyof TPaths[TPath]
> = express.Response<
  TResponseBody<TPaths[TPath][TMethod]>, // ResBody
  Record<string, any> // Locals
>;
