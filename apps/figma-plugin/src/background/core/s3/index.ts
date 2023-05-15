import S3 from '@pda/s3';
import { s3Config } from '../../environment';

export const s3 = new S3({
  bucket: '',
  client: {
    forcePathStyle: false,
    endpoint: s3Config.endpoint,
    region: s3Config.region,
    credentials: {
      accessKeyId: s3Config.credentials.accessKeyId,
      secretAccessKey: s3Config.credentials.secretAccessKey,
    },
  },
});
