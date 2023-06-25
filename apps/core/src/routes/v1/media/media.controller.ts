import { randomUUID } from 'crypto';
import express from 'express';
import { query } from 'express-validator';
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
    },
    {}
  >,
  res: express.Response
) {
  const { contentType, key, scope, overwrite = false } = req.query;

  // Check whether object already exists
  if (key != null && !overwrite && (await s3.doesObjectExist(key))) {
    res.status(200).send();
    return;
  }

  // Generate presigned upload url
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
