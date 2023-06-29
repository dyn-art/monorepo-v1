import axios from 'axios';
import { ServiceException } from '../exceptions/ServiceException';

export function isStatusCode(error: unknown, errorCode: number): boolean {
  // Handle axios error
  if (axios.isAxiosError(error)) {
    return error.response != null && error.response.status === errorCode;
  }

  // Handle RequestException
  if (error instanceof ServiceException) {
    return error.status === 404;
  }

  return false;
}
