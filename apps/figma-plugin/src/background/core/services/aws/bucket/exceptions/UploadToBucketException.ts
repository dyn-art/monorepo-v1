import { extractErrorData } from '@dyn/utils';

export class UploadToBucketException extends Error {
  public readonly throwable?: Error;

  constructor(throwable?: unknown) {
    const errorData = throwable != null ? extractErrorData(throwable) : null;
    super(
      `Failed to upload file to S3 bucket${
        errorData != null ? ` by error: ${errorData.message}` : '!'
      }`
    );
    this.throwable = errorData?.error ?? undefined;
  }
}
