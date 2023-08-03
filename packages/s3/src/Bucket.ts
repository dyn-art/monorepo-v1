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

export default class Bucket {
  private readonly _client: S3Client;
  private readonly _name: string;

  constructor(config: TBucketConfig) {
    const { client, name } = config;
    this._client = client instanceof S3Client ? client : new S3Client(client);
    this._name = name;
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/headobjectcommand.html
  async doesObjectExist(key: string): Promise<boolean> {
    try {
      await this._client.send(
        new HeadObjectCommand({
          Bucket: this._name,
          Key: key,
        })
      );
      return true;
    } catch (error) {
      if (error instanceof NotFound) {
        return false;
      } else {
        throw mapS3Error(error, S3ServiceException, `${this._name}/${key}`);
      }
    }
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
  async uploadObject(
    key: string,
    data: PutObjectCommandInputType['Body']
  ): Promise<PutObjectCommandOutput> {
    try {
      return await this._client.send(
        new PutObjectCommand({
          Bucket: this._name,
          Key: key,
          Body: data,
        })
      );
    } catch (error) {
      throw mapS3Error(error, S3ServiceException, `${this._name}/${key}`);
    }
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectcommand.html
  async deleteObject(key: string): Promise<DeleteObjectCommandOutput> {
    try {
      return await this._client.send(
        new DeleteObjectCommand({
          Bucket: this._name,
          Key: key,
        })
      );
    } catch (error) {
      throw mapS3Error(error, S3ServiceException, `${this._name}/${key}`);
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
      const response = await this._client.send(
        new GetObjectCommand({
          Bucket: this._name,
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
        throw mapS3Error(error, S3ServiceException, `${this._name}/${key}`);
      }
    }
  }

  async getDownloadUrl(key: string): Promise<string | null> {
    if (typeof this._client.config.endpoint !== 'function') {
      return null;
    }
    const endpoint = await this._client.config.endpoint();
    const protocol = endpoint.protocol;
    const hostname = endpoint.hostname;
    const port = endpoint.port ? `:${endpoint.port}` : '';
    const trimmedPath = endpoint.path.endsWith('/')
      ? endpoint.path.slice(0, -1)
      : endpoint.path;
    const path = `${trimmedPath}/${this._name}/${key}`;
    return `${protocol}//${hostname}${port}${path}`;
  }

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
  async getPreSignedDownloadUrl(
    key: string,
    options: { expiresIn?: number } = {}
  ): Promise<string | null> {
    const { expiresIn = 15 * 60 } = options;
    try {
      const url = await getSignedUrl(
        this._client,
        new GetObjectCommand({
          Bucket: this._name,
          Key: key,
        }),
        { expiresIn }
      );
      return url;
    } catch (error) {
      if (error instanceof NoSuchKey || error instanceof InvalidObjectState) {
        return null;
      } else {
        throw mapS3Error(error, S3ServiceException, `${this._name}/${key}`);
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
        this._client,
        new PutObjectCommand({
          Bucket: this._name,
          Key: key,
          ContentType: contentType,
          ACL: scope,
        }),
        { expiresIn }
      );
      return url;
    } catch (error) {
      throw mapS3Error(error, S3ServiceException, `${this._name}/${key}`);
    }
  }
}

export type TBucketConfig = { client: S3ClientConfig | S3Client; name: string };

type TDownloadOutputType = 'string' | 'byteArray' | 'stream';
type TDownloadResponseType<TOutputType extends TDownloadOutputType> =
  TOutputType extends 'string'
    ? string
    : TOutputType extends 'byteArray'
    ? Uint8Array
    : ReadableStream;
