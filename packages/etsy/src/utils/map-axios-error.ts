import axios from 'axios';
import { EtsyServiceException } from '../exceptions/EtsyServiceException';
import { NetworkException } from '../exceptions/NetworkException';
import { logger } from '../logger';

export function mapAxiosError<T extends EtsyServiceException>(
  error: unknown,
  ExceptionType: new (...args: any[]) => T
): Error {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      const exception = new NetworkException({
        message: 'The request was timed out!',
        code: error.code,
        throwable: error,
      });
      logger.error(exception.message);
      return exception;
    }
    // This catches network errors like ECONNREFUSED, ECONNRESET etc.
    else if (error.code != null) {
      const exception = new NetworkException({
        message: 'Network error occurred!',
        code: error.code,
        throwable: error,
      });
      logger.error(exception.message);
      return exception;
    }

    // Handle response error
    const response = error.response;
    if (response != null) {
      let message: string;
      switch (response.status) {
        case 400:
          message = 'Bad Request';
          break;
        case 401:
          message = 'Unauthorized';
          break;
        case 403:
          message = 'Forbidden';
          break;
        case 404:
          message = 'Not Found';
          break;
        case 429:
          message = 'Too Many Requests';
          break;
        case 500:
          message = 'Internal Server Error';
          break;
        default:
          message = 'Unknown HTTP error occurred';
          break;
      }
      const exception = new ExceptionType({
        message: `${message}: ${error.message}`,
        status: response.status,
        throwable: error,
      });
      logger.error(exception.message);
      return exception;
    }

    // Handle if request was made but no response was received
    const request = error.request;
    if (request != null) {
      const exception = new NetworkException({
        message: 'The request was made but no response was received',
        code: 408,
        throwable: error,
      });
      logger.error(exception.message);
      return exception;
    }

    // Handle unknown request error
    const exception = new ExceptionType({
      message: 'An unknown request error occurred!',
      throwable: error,
    });
    logger.error(exception.message);
    return exception;
  }

  // Handle non Axios error
  if (error instanceof Error) {
    logger.error(error.message);
    return error;
  }

  logger.error('An unknown error occurred!');
  return new Error('An unknown error occurred!');
}
