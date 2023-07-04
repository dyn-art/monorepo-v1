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
      raw: error as any,
      description: errorDescription,
    });
  } catch {
    const error = await response.clone().text();
    return new RequestException(defaultErrorCode, response.status, {
      description: error,
      raw: error as any,
    });
  }
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
