import axios, { AxiosError } from 'axios';
import { CoreServiceException, NetworkException } from '../exceptions';
import { logger } from '../logger';

export function mapAxiosError<T extends CoreServiceException>(
  error: unknown,
  ExceptionType: new (...args: any[]) => T
): Error {
  // Handle Axios errors
  const axiosError = handleAxiosError(error, ExceptionType);
  if (axiosError != null) {
    return axiosError;
  }

  // Handle non Axios error
  if (error instanceof Error) {
    logger.error(error.message);
    return error;
  }

  logger.error('An unknown error occurred!');
  return new Error('An unknown error occurred!');
}

function handleAxiosError<T extends CoreServiceException>(
  error: unknown,
  ExceptionType: new (...args: any[]) => T
): Error | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  // Handle response error
  const responseError = mapResponseAxiosError(error, ExceptionType);
  if (responseError != null) {
    return responseError;
  }

  // Handle network error
  const networkError = mapNetworkAxiosError(error);
  if (networkError != null) {
    return networkError;
  }

  // Handle if request was made but no response was received
  const nonResponseError = mapNonReceivedResponseAxiosError(error);
  if (nonResponseError != null) {
    return nonResponseError;
  }

  // Handle unknown request error
  return mapUnknownAxiosError(error, ExceptionType);
}

function mapNetworkAxiosError(error: AxiosError): Error | null {
  // Handle network errors
  if (error.code != null) {
    let message = 'Network error occurred!';
    switch (error.code) {
      case 'ECONNABORTED':
        message = 'The request was timed out!';
        break;
      case 'ECONNREFUSED':
        message = 'The request was refused!';
        break;
      case 'ECONNRESET':
        message = 'The request was abruptly closed!';
        break;
      default:
      // do nothing
    }
    const exception = new NetworkException(error.code, message, {
      throwable: error,
    });
    logger.error(exception.message);
    return exception;
  }
  return null;
}

// The request was made and the server responded with a status code
// that falls out of the range of 2xx
// https://axios-http.com/docs/handling_errors
function mapResponseAxiosError<T extends CoreServiceException>(
  error: AxiosError,
  ExceptionType: new (...args: any[]) => T
): Error | null {
  const response = error.response;
  const data =
    typeof response?.data === 'object' && response.data != null
      ? response.data
      : {};
  if (response != null) {
    const exception = new ExceptionType(
      'error_code' in data ? data.error_code : error.code,
      'error_description' in data ? data['error_description'] : error.message,
      {
        status: response.status,
        throwable: error,
      }
    );
    logger.error(exception.message);
    return exception;
  }
  return null;
}

// The request was made but no response was received
// https://axios-http.com/docs/handling_errors
function mapNonReceivedResponseAxiosError(error: AxiosError): Error | null {
  const request = error.request;
  if (request != null) {
    const exception = new NetworkException(
      'ERR_NO_RESPONSE',
      'The request was made but no response was received!',
      {
        throwable: error,
      }
    );
    logger.error(exception.message);
    return exception;
  }
  return null;
}

// Something happened in setting up the request that triggered an Error
// https://axios-http.com/docs/handling_errors
function mapUnknownAxiosError<T extends CoreServiceException>(
  error: AxiosError,
  ExceptionType: new (...args: any[]) => T
): Error {
  const exception = new ExceptionType(
    'ERR_UNKNOWN',
    'An unknown request error occurred!',
    {
      throwable: error,
    }
  );
  logger.error(exception.message);
  return exception;
}
