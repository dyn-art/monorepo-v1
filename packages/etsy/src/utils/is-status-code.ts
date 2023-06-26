import axios from 'axios';
import { EtsyServiceException } from '../exceptions/EtsyServiceException';

export function isStatusCode(error: unknown, errorCode: number): boolean {
  // Handle axios error
  if (axios.isAxiosError(error)) {
    return error.response != null && error.response.status === errorCode;
  }

  // Handle RequestException
  if (error instanceof EtsyServiceException) {
    return error.statusCode === 404;
  }

  return false;
}
