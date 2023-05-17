import { randomUUID } from 'crypto';
import express from 'express';
import { s3 } from '../../../core/aws';
import { AppError } from '../../../middlewares';

export async function getPreSignedUploadUrl(
  req: express.Request,
  res: express.Response
) {
  const { contentType, key, scope } = req.query;

  // Validate query parameters
  if (typeof contentType !== 'string' || typeof scope !== 'string') {
    throw new AppError(500, 'Invalid query parameters provided!');
  }

  // Generate presigned upload url
  const uploadUrl = await s3.preSignedUploadUrl(
    typeof key === 'string' ? key : randomUUID(),
    { contentType, expiresIn: 5 * 60, scope }
  );

  res.send({
    uploadUrl,
    key,
  });
}
