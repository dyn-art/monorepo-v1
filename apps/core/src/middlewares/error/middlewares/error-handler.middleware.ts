import { components } from '@pda/types/core';
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
  const jsonResponse: components['schemas']['ServerError'] = {
    error_code: '#ERR_UNKNOWN',
    error_description: null,
    error_uri: null,
    additional_errors: [],
  };

  // Handle application-specific errors (instances of AppError)
  if (err instanceof AppError) {
    statusCode = err.status;
    jsonResponse.error_code = err.code;
    jsonResponse.error_description = err.description ?? null;
    jsonResponse.error_uri = err.uri ?? null;
    jsonResponse.additional_errors = err.additionalErrors as any;
  }

  // Handle unknown errors
  else if (typeof err === 'object' && err != null) {
    if ('message' in err && typeof err.message === 'string') {
      jsonResponse.error_description = err.message;
    }
    if ('code' in err && typeof err.code === 'string') {
      jsonResponse.error_code = err.code;
    }
  } else {
    jsonResponse.error_description = 'An unknown error occurred!';
  }

  // Send the error response with appropriate status code
  res.status(statusCode);
  res.json(jsonResponse);
}
