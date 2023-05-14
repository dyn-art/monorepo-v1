import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

export default class S3 {
  private client: S3Client;
  private bucket: string;

  constructor(options: TS3Config) {
    this.client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
    this.bucket = options.bucket;
  }

  async upload(key: string, data: Buffer): Promise<void> {
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: data,
    });

    await this.client.send(putObjectCommand);
  }

  async download(key: string): Promise<Blob> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(getObjectCommand);
    const data = response.Body as ReadableStream;

    return new Blob([data as any]);
  }
}

export type TS3Config = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
};
