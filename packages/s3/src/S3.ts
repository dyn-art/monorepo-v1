import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInputType,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from './logger';

export default class S3 {
  private client: S3Client;
  private bucket: string;

  constructor(config: TS3Config) {
    this.client = new S3Client({
      ...config.client,
    });
    this.bucket = config.bucket;
  }

  async upload(
    key: string,
    data: PutObjectCommandInputType['Body']
  ): Promise<boolean> {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: data,
        })
      );
      logger.success(`Successfully upload object to '${this.bucket}/${key}'.`);
      return true;
    } catch (e) {
      logger.error(`Failed to upload object to '${this.bucket}/${key}'!`, e);
    }
    return false;
  }

  async listFiles(): Promise<any> {
    try {
      const response = await this.client.send(
        new ListObjectsCommand({ Bucket: this.bucket })
      );
      logger.success(
        `Successfully fetched file list from bucket '${this.bucket}'.`,
        response
      );
      return response;
    } catch (e) {
      logger.error(
        `Failed to fetch file list from bucket '${this.bucket}'!`,
        e
      );
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      logger.success(
        `Successfully deleted object from '${this.bucket}/${key}'.`
      );
      return true;
    } catch (e) {
      logger.error(`Failed to delete object from '${this.bucket}/${key}'!`, e);
    }
    return false;
  }

  async download<TOutputType extends TDownloadOutputType>(
    key: string,
    config: {
      outputType?: TOutputType;
    } = {}
  ): Promise<TDownloadResponseType<TOutputType> | null> {
    const { outputType = 'string' } = config;
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      let data: string | Uint8Array | ReadableStream | null = null;
      if (outputType === 'string') {
        data = (await response.Body?.transformToString()) ?? null;
      } else if (outputType === 'byteArray') {
        data = (await response.Body?.transformToByteArray()) ?? null;
      } else if (outputType === 'stream') {
        data = response.Body?.transformToWebStream() ?? null;
      }
      logger.success(
        `Successfully downloaded object from '${this.bucket}/${key}'.`
      );
      return data as TDownloadResponseType<TOutputType>;
    } catch (e) {
      logger.error(
        `Failed to download object from '${this.bucket}/${key}'!`,
        e
      );
    }
    return null;
  }

  async preSignedDownloadUrl(
    key: string,
    config: { expiresIn?: number } = {}
  ): Promise<string | null> {
    const { expiresIn = 15 * 60 } = config;
    try {
      const url = await getSignedUrl(
        this.client,
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
        { expiresIn }
      );
      logger.success(
        `Successfully created pre-signed url to download for '${this.bucket}/${key}'.`,
        url
      );
      return url;
    } catch (e) {
      logger.error(
        `Failed to create pre-signed url to download for '${this.bucket}/${key}'!`,
        e
      );
    }
    return null;
  }

  async preSignedUploadUrl(
    key: string,
    config: { contentType?: string; expiresIn?: number; scope?: string } = {}
  ): Promise<string | null> {
    const { contentType = 'text', expiresIn = 15 * 60, scope } = config;
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
      logger.success(
        `Successfully created pre-signed url to upload to '${this.bucket}/${key}'.`,
        url
      );
      return url;
    } catch (e) {
      logger.error(
        `Failed to create pre-signed url to upload to '${this.bucket}/${key}'!`,
        e
      );
    }
    return null;
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
