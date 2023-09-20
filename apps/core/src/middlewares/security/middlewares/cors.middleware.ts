import cors from 'cors';
import express from 'express';
import { logger } from '../../../core/logger';
import { appConfig } from '../../../environment';
import { AppError } from '../../error';

export function corsMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  cors({
    origin: (origin, callback) => {
      let valid = false;

      // TODO: Remove and create proxy for Figma Plugin for more secure handling
      // https://forum.figma.com/t/access-to-jira-api/8484
      // Check for temporary CORS API Key (e.g. for Figma Plugin which has not origin)
      const apiKey = req.header('X-CORS-API-KEY');
      if (req.method === 'OPTIONS' || apiKey === appConfig.corsApiKey) {
        valid = true;
      }

      // Check for CORS origins
      if (
        appConfig.corsOrigins === '*' ||
        appConfig.corsOrigins === origin ||
        (origin != null &&
          Array.isArray(appConfig.corsOrigins) &&
          appConfig.corsOrigins.includes(origin))
      ) {
        valid = true;
      }

      // Call callback
      if (valid) {
        callback(null, true);
      } else {
        logger.error(`Not allowed by CORS origin for '${origin}'!`, {
          allowedOrigins: appConfig.corsOrigins,
        });
        callback(
          new AppError(403, `Not allowed by CORS origin for '${origin}'!`)
        );
      }
    },
    credentials: true, // Enable Access-Control-Allow-Credentials
  })(req, res, next);
}
