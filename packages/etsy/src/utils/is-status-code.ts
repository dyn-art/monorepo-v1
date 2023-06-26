import axios from 'axios';
import { RequestException } from '../exceptions/RequestException';

export function isStatusCode(error: unknown, errorCode: number): boolean {
  // Handle axios error
  if (axios.isAxiosError(error)) {
    return error.response != null && error.response.status === errorCode;
  }

  // Handle RequestException
  if (error instanceof RequestException) {
    return error.status === 404;
  }

  return false;
}
