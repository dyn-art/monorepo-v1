import { randomUUID } from 'crypto';
import express from 'express';
import { s3 } from '../../../core/aws';
import { AppError } from '../../../middlewares';

export async function getPreSignedUploadUrl(
  req: express.Request,
  res: express.Response
) {
  const { contentType, key, scope, overwrite = false } = req.query;

  // Validate query parameters
  if (
    typeof contentType !== 'string' ||
    typeof scope !== 'string' ||
    typeof overwrite !== 'boolean'
  ) {
    throw new AppError(500, 'Invalid query parameters provided!');
  }

  // Check whether object already exists
  if (
    !overwrite &&
    typeof key === 'string' &&
    (await s3.doesObjectExist(key))
  ) {
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
