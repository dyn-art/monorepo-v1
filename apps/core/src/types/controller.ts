import { paths } from '@pda/types/core';
import express from 'express';
import { ValidationChain } from 'express-validator';
import { TOpenAPIRequest, TOpenAPIResponse } from './route';

export type TRequestControllerMethod<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> = (
  req: TOpenAPIRequest<paths, TPath, TMethod>,
  res: TOpenAPIResponse<paths, TPath, TMethod>,
  next: express.NextFunction
) => Promise<void>;

export type TRequestController<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> =
  | [TRequestControllerMethod<TPath, TMethod>, ValidationChain[]]
  | TRequestControllerMethod<TPath, TMethod>;
