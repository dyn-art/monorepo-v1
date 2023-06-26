import { S3ServiceException } from '@aws-sdk/client-s3';
import { S3ServiceException as PDAS3ServiceException } from '../exceptions';
import { logger } from '../logger';

export function mapS3Error<T extends PDAS3ServiceException>(
  error: unknown,
  ExceptionType: new (...args: any[]) => T,
  route?: string
): Error {
  // Handle S3 errors
  if (error instanceof S3ServiceException) {
    let message: string;
    switch (error.name) {
      case 'NoSuchBucket':
        message = 'Bucket not found';
        break;
      case 'NotFound':
        message = 'Specified content not found';
        break;
      case 'NoSuchKey':
        message = 'Key not found';
        break;
      case 'NoSuchUpload':
        message = 'The specified multipart upload does not exist';
        break;
      case 'ObjectNotInActiveTierError':
        message =
          'The source object of the COPY action is not in the active tier';
        break;
      case 'BucketAlreadyExists':
        message = 'The requested bucket name is not available';
        break;
      case 'BucketAlreadyOwnedByYou':
        message =
          'The bucket you tried to create already exists, and you own it';
        break;
      case 'InvalidObjectState':
        message = 'Object is archived and inaccessible until restored';
        break;
      default:
        message = 'Unknown S3 service error occurred';
        break;
    }
    const exception = new ExceptionType({
      message: `${message}${
        error.message != null ? `: ${error.message}` : '!'
      }`,
      name: error.name,
      throwable: error,
      route,
    });
    logger.error(exception.message);
    return exception;
  }

  // Handle non S3 error
  if (error instanceof Error) {
    logger.error(error.message);
    return error;
  }

  logger.error('An unknown error occurred!');
  return new Error('An unknown error occurred!');
}
