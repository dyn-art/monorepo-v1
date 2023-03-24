import express from 'express';

/**
 * Error handling middleware for logging errors to the console.
 */
export function errorLoggerMiddleware(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.error('\x1b[31m', err); // Adding some color to the log
  next(err);
}
