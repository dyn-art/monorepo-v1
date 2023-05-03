import express from 'express';
import { AppError } from '../AppError';
import { TErrorJsonResponseDto } from '../types';

/**
 * Error handling middleware for handling application-specific errors and unknown errors.
 * Sends a JSON response with error information.
 *
 * https://expressjs.com/en/guide/error-handling.html
 * https://reflectoring.io/express-error-handling/
 */
export function errorHandlerMiddleware(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let statusCode = 500;
  const jsonResponse: TErrorJsonResponseDto = {
    error: 'not-set',
    error_description: null,
    error_uri: null,
  };

  // Handle application-specific errors (instances of AppError)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    jsonResponse.error = err.message;
    jsonResponse.error_description = err.description;
    jsonResponse.error_uri = err.uri;
  }
  // Handle unknown errors
  else {
    if (err.message != null) {
      jsonResponse.error = err.message;
    }
    if (typeof err.status === 'number') {
      statusCode = err.status;
    }
  }

  // Send the error response with appropriate status code
  res.status(statusCode);
  res.json(jsonResponse);
}
