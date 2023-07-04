import { NetworkException } from '../exceptions';

export function mapCatchToNetworkException(
  error: unknown,
  defaultErrorCode = '#ERR_NETWORK'
): NetworkException {
  if (error instanceof Error) {
    return new NetworkException(defaultErrorCode, {
      throwable: error,
      description: error.message ?? undefined,
    });
  } else {
    return new NetworkException(defaultErrorCode);
  }
}
