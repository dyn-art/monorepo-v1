import { s3 } from '@/core/aws';
import { TRequestController } from '@/types';
import { randomUUID } from 'crypto';
import { param, query } from 'express-validator';

export const getPreSignedUploadUrl: TRequestController<
  '/v1/media/pre-signed-upload-url',
  'get'
> = [
  async (req, res) => {
    const { content_type, key, scope, overwrite = false } = req.query;

    // Check whether object already exists
    if (key != null && !overwrite) {
      const exists = await s3.doesObjectExist(key);
      if (exists) {
        res.sendStatus(200);
        return;
      }
    }

    // Generate presigned upload URL
    const finalKey = typeof key === 'string' ? key : randomUUID();
    const uploadUrl = await s3.getPreSignedUploadUrl(finalKey, {
      contentType: content_type,
      expiresIn: 5 * 60,
      scope,
    });

    res.status(201).send({
      upload_url: uploadUrl,
      key: finalKey,
    });
  },
  [
    query('contentType').optional().isString(),
    query('scope').optional().isString(),
    query('overwrite').optional().isBoolean(),
    query('key').optional().isString(),
  ],
];

export const getPreSignedDownloadUrl: TRequestController<
  '/v1/media/pre-signed-download-url/{key}',
  'get'
> = [
  async (req, res) => {
    const { key } = req.params;

    // Check whether object exists
    const exists = await s3.doesObjectExist(key);
    if (!exists) {
      res.sendStatus(404);
      return;
    }

    // Generate presigned download URL
    const downloadUrl = await s3.getPreSignedDownloadUrl(key);
    if (downloadUrl == null) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send({ download_url: downloadUrl, key });
  },
  [param('key').notEmpty().isString()],
];
