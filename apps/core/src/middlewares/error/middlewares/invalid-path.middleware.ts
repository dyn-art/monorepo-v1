import express from 'express';
import { AppError } from '../AppError';

/**
 * Middleware function to catch unregistered routes as 404 errors.
 * This middleware should be placed after all other routes in the middleware stack.
 * It will call the next middleware (the error handling middleware) with an AppError containing a 404 status code.
 */
export function invalidPathHandlerMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Call the next middleware with a 404 AppError (usually the error handling middleware)
  next(new AppError(404, "Route doesn't exist!"));
}
