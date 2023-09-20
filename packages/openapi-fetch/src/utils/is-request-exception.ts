import { RequestException } from '../exceptions';

export function isRequestException<T>(
  error: RequestException<T> | Error
): error is RequestException<T> {
  return error instanceof RequestException;
}
