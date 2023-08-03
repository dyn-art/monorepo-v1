import { RequestException } from '../exceptions';

export async function mapResponseToRequestException(
  response: Response,
  defaultErrorCode = '#ERR_UNKNOWN'
): Promise<RequestException> {
  try {
    const error = await response.clone().json();
    const errorCode = getErrorCode(error) ?? defaultErrorCode;
    const errorDescription = getErrorDescription(error) ?? undefined;
    return new RequestException(errorCode, response.status, {
      data: error as any,
      description: errorDescription,
      response,
    });
  } catch {
    const error = await response.clone().text();
    return new RequestException(defaultErrorCode, response.status, {
      description: error,
      data: error as any,
      response,
    });
  }
}

function getErrorDescription(data: Record<string, any>): string | null {
  if (
    'error_description' in data &&
    typeof data.error_description === 'string'
  ) {
    return data.error_description;
  } else if ('error' in data) {
    if (typeof data.error === 'string') {
      return data.error;
    } else if (typeof data.error === 'object') {
      return getErrorDescription(data.error);
    }
  } else if ('message' in data && typeof data.message === 'string') {
    return data.message;
  }
  return null;
}

function getErrorCode(data: Record<string, any>): string | null {
  if ('error_code' in data && typeof data.error_code === 'string') {
    return data.error_code;
  } else if ('status' in data && typeof data.status === 'string') {
    return data.status;
  } else if ('code' in data && typeof data.code === 'string') {
    return data.code;
  } else if ('error' in data && typeof data.error === 'object') {
    return getErrorCode(data.error);
  }
  return null;
}
