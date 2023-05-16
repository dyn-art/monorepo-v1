import { randomUUID } from 'crypto';
import express from 'express';
import { s3 } from '../../../core/aws';
import { AppError } from '../../../middlewares';

export async function getPreSignedUploadUrl(
  req: express.Request,
  res: express.Response
) {
  const { contentType, key } = req.query;

  // Validate query parameters
  if (typeof contentType !== 'string') {
    throw new AppError(500, 'Invalid query parameters provided!');
  }

  // Create upload url
  const uploadUrl = await s3.preSignedUploadUrl(
    typeof key === 'string' ? key : randomUUID(),
    contentType,
    60
  );

  res.send({
    uploadUrl,
    key,
  });
}
