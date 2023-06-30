import { Logger } from '@pda/logger';
import axios, { AxiosError } from 'axios';
import { NetworkException, ServiceException } from '../exceptions';
import { logger as clientUtilsLogger } from '../logger';

export function createMapAxiosError<TServiceException extends ServiceException>(
  logger: Logger = clientUtilsLogger,
  ParentExceptionType: new (...args: any[]) => TServiceException
) {
  return <T extends ServiceException = TServiceException>(
    error: unknown,
    ExceptionType: new (...args: any[]) => T = ParentExceptionType as any
  ) => mapAxiosError<T>(error, ExceptionType, logger);
}

export function mapAxiosError<T extends ServiceException>(
  error: unknown,
  ExceptionType: new (...args: any[]) => T,
  logger: Logger = clientUtilsLogger
): Error {
  // Handle Axios errors
  const axiosError = handleAxiosError(error, ExceptionType, logger);
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

function handleAxiosError<T extends ServiceException>(
  error: unknown,
  ExceptionType: new (...args: any[]) => T,
  logger: Logger
): Error | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  // Handle response error
  const responseError = mapResponseAxiosError(error, ExceptionType, logger);
  if (responseError != null) {
    return responseError;
  }

  // Handle network error
  const networkError = mapNetworkAxiosError(error, logger);
  if (networkError != null) {
    return networkError;
  }

  // Handle if request was made but no response was received
  const nonResponseError = mapNonReceivedResponseAxiosError(error, logger);
  if (nonResponseError != null) {
    return nonResponseError;
  }

  // Handle unknown request error
  return mapUnknownAxiosError(error, ExceptionType, logger);
}

// Handle network errors
function mapNetworkAxiosError(error: AxiosError, logger: Logger): Error | null {
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
    const exception = new NetworkException(`#${error.code}`, {
      description: message,
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
function mapResponseAxiosError<T extends ServiceException>(
  error: AxiosError,
  ExceptionType: new (...args: any[]) => T,
  logger: Logger
): Error | null {
  const response = error.response;
  const data: Record<string, any> =
    typeof response?.data === 'object' && response.data != null
      ? response.data
      : {};
  const errorCode = getErrorCode(data) ?? error.code;
  const errorDescription = getErrorDescription(data) ?? error.message;
  if (response != null) {
    const exception = new ExceptionType(errorCode, {
      description: errorDescription,
      status: response.status,
      throwable: error,
    });
    logger.error(exception.message);
    return exception;
  }
  return null;
}

// The request was made but no response was received
// https://axios-http.com/docs/handling_errors
function mapNonReceivedResponseAxiosError(
  error: AxiosError,
  logger: Logger
): Error | null {
  const request = error.request;
  if (request != null) {
    const exception = new NetworkException('#ERR_NO_RESPONSE', {
      throwable: error,
      description: 'The request was made but no response was received!',
    });
    logger.error(exception.message);
    return exception;
  }
  return null;
}

// Something happened in setting up the request that triggered an Error
// https://axios-http.com/docs/handling_errors
function mapUnknownAxiosError<T extends ServiceException>(
  error: AxiosError,
  ExceptionType: new (...args: any[]) => T,
  logger: Logger
): Error {
  const exception = new ExceptionType('#ERR_UNKNOWN', {
    description: 'An unknown request error occurred!',
    throwable: error,
  });
  logger.error(exception.message);
  return exception;
}

function getErrorDescription(data: Record<string, any>): string | null {
  if ('error_description' in data) {
    return data.error_description;
  } else if ('error' in data) {
    return data.error;
  }
  return null;
}

function getErrorCode(data: Record<string, any>): string | null {
  if ('error_code' in data) {
    return data.error_code;
  } else if ('code' in data) {
    return data.code;
  }
  return null;
}
