import axios from 'axios';
import { NetworkException } from '../exceptions/NetworkException';
import { RequestException } from '../exceptions/RequestException';

export function handleAxiosError<T extends RequestException>(
  error: unknown,
  ExceptionType: new (...args: any[]) => T
): Error {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return new NetworkException({
        message: 'The request was timed out!',
        code: error.code,
        throwable: error,
      });
    }
    // This catches network errors like ECONNREFUSED, ECONNRESET etc.
    else if (error.code != null) {
      return new NetworkException({
        message: 'Network error occurred!',
        code: error.code,
        throwable: error,
      });
    }

    // Handle response errors
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
      return new ExceptionType({
        message: `${message}: ${error.message}`,
        status: response.status,
        throwable: error,
      });
    }

    // Handle if request was made but no response was received
    const request = error.request;
    if (request != null) {
      return new NetworkException({
        message: 'The request was made but no response was received',
        code: 408,
        throwable: error,
      });
    }

    // Handle unknown request error
    return new ExceptionType({
      message: 'An unknown request error occurred!',
      throwable: error,
    });
  }

  // Handle non Axios errors
  if (error instanceof Error) {
    return error;
  }

  return new Error('An unknown error occurred!');
}
