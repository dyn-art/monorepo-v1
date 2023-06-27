import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  HeadObjectCommand,
  InvalidObjectState,
  NoSuchKey,
  NotFound,
  PutObjectCommand,
  PutObjectCommandInputType,
  PutObjectCommandOutput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3ServiceException } from './exceptions';
import { mapS3Error } from './utils';

export default class S3 {
  private client: S3Client;
  private bucket: string;

  constructor(config: TS3Config) {
    this.client = new S3Client({
      ...config.client,
    });
    this.bucket = config.bucket;
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/headobjectcommand.html
  async doesObjectExist(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (error) {
      if (error instanceof NotFound) {
        return false;
      } else {
        throw mapS3Error(error, S3ServiceException, `${this.bucket}/${key}`);
      }
    }
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
  async uploadObject(
    key: string,
    data: PutObjectCommandInputType['Body']
  ): Promise<PutObjectCommandOutput> {
    try {
      return await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: data,
        })
      );
    } catch (error) {
      throw mapS3Error(error, S3ServiceException, `${this.bucket}/${key}`);
    }
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectcommand.html
  async deleteObject(key: string): Promise<DeleteObjectCommandOutput> {
    try {
      return await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
    } catch (error) {
      throw mapS3Error(error, S3ServiceException, `${this.bucket}/${key}`);
    }
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
  async downloadObject<TOutputType extends TDownloadOutputType>(
    key: string,
    options: {
      outputType?: TOutputType;
    } = {}
  ): Promise<TDownloadResponseType<TOutputType> | null> {
    const { outputType = 'string' } = options;
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      let data: string | Uint8Array | ReadableStream | null = null;
      switch (outputType) {
        case 'string':
          data = (await response.Body?.transformToString()) ?? null;
          break;
        case 'byteArray':
          data = (await response.Body?.transformToByteArray()) ?? null;
          break;
        case 'stream':
          data = response.Body?.transformToWebStream() ?? null;
          break;
        default:
        // do nothing
      }
      return data as TDownloadResponseType<TOutputType>;
    } catch (error) {
      if (error instanceof NoSuchKey) {
        return null;
      } else {
        throw mapS3Error(error, S3ServiceException, `${this.bucket}/${key}`);
      }
    }
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
  async getPreSignedDownloadUrl(
    key: string,
    options: { expiresIn?: number } = {}
  ): Promise<string | null> {
    const { expiresIn = 15 * 60 } = options;
    try {
      const url = await getSignedUrl(
        this.client,
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
        { expiresIn }
      );
      return url;
    } catch (error) {
      if (error instanceof NoSuchKey || error instanceof InvalidObjectState) {
        return null;
      } else {
        throw mapS3Error(error, S3ServiceException, `${this.bucket}/${key}`);
      }
    }
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
  async getPreSignedUploadUrl(
    key: string,
    options: { contentType?: string; expiresIn?: number; scope?: string } = {}
  ): Promise<string> {
    const {
      contentType = 'text',
      expiresIn = 15 * 60,
      scope = 'authenticated-read',
    } = options;
    try {
      const url = await getSignedUrl(
        this.client,
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          ContentType: contentType,
          ACL: scope,
        }),
        { expiresIn }
      );
      return url;
    } catch (error) {
      throw mapS3Error(error, S3ServiceException, `${this.bucket}/${key}`);
    }
  }
}

export type TS3Config = { client: S3ClientConfig; bucket: string };

type TDownloadOutputType = 'string' | 'byteArray' | 'stream';
type TDownloadResponseType<TOutputType extends TDownloadOutputType> =
  TOutputType extends 'string'
    ? string
    : TOutputType extends 'byteArray'
    ? Uint8Array
    : ReadableStream;
