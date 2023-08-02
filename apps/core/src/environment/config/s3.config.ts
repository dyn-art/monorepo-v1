const endpoint = process.env.S3_ENDPOINT ?? 'not-set';
const region = process.env.S3_REGION ?? 'not-set';
const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? 'not-set';
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? 'not-set';

export default {
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
};
