import {
  TRequestBody,
  TRequestPathParamsObject,
  TRequestQueryParamsObject,
  TResponseBody,
} from '@pda/openapi-fetch';
import { paths } from '@pda/types/core';
import express from 'express';
import * as core from 'express-serve-static-core';
import { ValidationChain } from 'express-validator';

type TRequestPathParamsForExpress<T> =
  undefined extends TRequestPathParamsObject<T>
    ? NonNullable<TRequestPathParamsObject<T>>
    : TRequestPathParamsObject<T> extends never
    ? core.ParamsDictionary
    : TRequestPathParamsObject<T>;

type TRequestQueryParamsForExpress<T> =
  undefined extends TRequestQueryParamsObject<T>
    ? NonNullable<TRequestQueryParamsObject<T>>
    : TRequestQueryParamsObject<T> extends never
    ? core.Query
    : TRequestQueryParamsObject<T>;

export type TOpenAPIRequest<
  TPaths extends {},
  TPath extends keyof TPaths,
  TMethod extends keyof TPaths[TPath]
> = express.Request<
  TRequestPathParamsForExpress<TPaths[TPath][TMethod]>, // Params
  TResponseBody<TPaths[TPath][TMethod]>, // ResBody
  TRequestBody<TPaths[TPath][TMethod]>, // ReqBody
  TRequestQueryParamsForExpress<TPaths[TPath][TMethod]>, // ReqQuery
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

export type TExpressRouteHandler<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> = (
  req: TOpenAPIRequest<paths, TPath, TMethod>,
  res: TOpenAPIResponse<paths, TPath, TMethod>,
  next: express.NextFunction
) => Promise<void>;

export type TExpressController<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> =
  | [TExpressRouteHandler<TPath, TMethod>, ValidationChain[]]
  | TExpressRouteHandler<TPath, TMethod>;
