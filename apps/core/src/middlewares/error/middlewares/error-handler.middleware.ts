import { TError_ResponseDTO } from '@pda/core-types';
import express from 'express';
import { AppError } from '../AppError';

/**
 * Error handling middleware for handling application-specific errors and unknown errors.
 * Sends a JSON response with error information.
 *
 * https://expressjs.com/en/guide/error-handling.html
 * https://reflectoring.io/express-error-handling/
 */
export function errorHandlerMiddleware(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let statusCode = 500;
  const jsonResponse: TError_ResponseDTO = {
    error: 'not-set',
    error_description: null,
    error_uri: null,
    additional_errors: [],
  };

  // Handle application-specific errors (instances of AppError)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    jsonResponse.error = err.message;
    jsonResponse.error_description = err.description;
    jsonResponse.error_uri = err.uri;
    jsonResponse.additional_errors = err.additionalErrors;
  }

  // Handle unknown errors
  else if (typeof err === 'object' && err != null) {
    if ('message' in err && typeof err.message === 'string') {
      jsonResponse.error = err.message;
    }
    if ('status' in err && typeof err.status === 'number') {
      statusCode = err.status;
    }
  } else {
    jsonResponse.error = 'An unknown error occurred!';
  }

  // Send the error response with appropriate status code
  res.status(statusCode);
  res.json(jsonResponse);
}
