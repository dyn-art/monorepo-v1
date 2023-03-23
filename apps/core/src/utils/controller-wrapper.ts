import express from 'express';
import { appConfig, STAGE } from '../environment';
import { AppError } from '../middlewares';

/**
 * Wrapper function for Express controllers to handle errors and stage-based activation.
 */
export function controllerWrapper(
  controller: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void>,
  stage?: STAGE
) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!stage || appConfig.stage === stage) {
        await controller(req, res, next);
      } else {
        throw new AppError(404);
      }
    } catch (e) {
      next(e);
    }
  };
}
