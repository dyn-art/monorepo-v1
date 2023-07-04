import { STAGE, appConfig } from '@/environment';
import { AppError } from '@/middlewares';
import { TRequestController } from '@/types';
import express from 'express';
import { validationResult } from 'express-validator';

export function controllerWrapper(
  controller: TRequestController<any, any>,
  stage?: STAGE
): any[] {
  if (Array.isArray(controller)) {
    return [...controller[1], controllerMethodWrapper(controller[0], stage)];
  } else {
    return [controllerMethodWrapper(controller, stage)];
  }
}

/**
 * Wrapper function for Express controllers to handle errors and stage-based activation.
 */
export function controllerMethodWrapper(
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
      // Check stage
      if (stage != null && appConfig.stage !== stage) {
        throw new AppError(404, '#ERR_NOT_FOUND');
      }

      // Check validation
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new AppError(400, '#ERR_BAD_REQUEST', {
          description:
            'Invalid query data provided! See additional errors for more information.',
          additionalErrors: result.array(),
        });
      }

      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
