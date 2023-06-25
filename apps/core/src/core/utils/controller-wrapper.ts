import express from 'express';
import { validationResult } from 'express-validator';
import { appConfig, STAGE } from '../../environment';
import { AppError } from '../../middlewares';

/**
 * Wrapper function for Express controllers to handle errors and stage-based activation.
 */
export function controllerWrapper(
  controller: (
    req: express.Request<any, any, any, any, any>,
    res: express.Response<any, any>,
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
      // Check stage
      if (stage != null && appConfig.stage !== stage) {
        throw new AppError(404);
      }

      // Check validation
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new AppError(400, 'Bad Request', {
          description: 'Invalid query data provided! See additional errors.',
          additionalErrors: result.array(),
        });
      }

      await controller(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
