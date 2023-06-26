import { randomUUID } from 'crypto';
import express from 'express';
import { param, query } from 'express-validator';
import { s3 } from '../../../core/aws';

export async function getPreSignedUploadUrl(
  req: express.Request<
    {},
    {},
    {},
    {
      key?: string;
      contentType: string;
      scope?: string;
      overwrite: boolean;
    }
  >,
  res: express.Response
) {
  const { contentType, key, scope, overwrite = false } = req.query;

  // Check whether object already exists
  if (key != null && !overwrite) {
    const exists = await s3.doesObjectExist(key);
    if (exists) {
      res.status(200).send();
      return;
    }
  }

  // Generate presigned upload URL
  const uploadUrl = await s3.getPreSignedUploadUrl(
    typeof key === 'string' ? key : randomUUID(),
    { contentType, expiresIn: 5 * 60, scope }
  );

  res.status(201).send({
    uploadUrl,
    key,
  });
}

getPreSignedUploadUrl.validator = [
  query('contentType').notEmpty().isString(),
  query('scope').notEmpty().isString(),
  query('overwrite').optional().isBoolean(),
  query('key').optional().isString(),
];

export async function getPreSignedDownloadUrl(
  req: express.Request<{ key: string }>,
  res: express.Response
) {
  const { key } = req.params;

  // Check whether object exists
  const exists = await s3.doesObjectExist(key);
  if (!exists) {
    res.send(404);
  }

  // Generate presigned download URL
  const downloadUrl = await s3.getPreSignedDownloadUrl(key);

  res.status(200).send({ downloadUrl });
}

getPreSignedDownloadUrl.validator = [param('key').notEmpty().isString()];
