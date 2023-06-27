import {
  TGet_Media_PreSignedDownloadUrl_ParamsDTO,
  TGet_Media_PreSignedDownloadUrl_ResponseDTO,
  TGet_Media_PreSignedUploadUrl_QueryParamsDTO,
  TGet_Media_PreSignedUploadUrl_ResponseDTO,
} from '@pda/core-types';
import { randomUUID } from 'crypto';
import express from 'express';
import { param, query } from 'express-validator';
import { s3 } from '../../../core/aws';

export async function getPreSignedUploadUrl(
  req: express.Request<
    {},
    {},
    {},
    TGet_Media_PreSignedUploadUrl_QueryParamsDTO
  >,
  res: express.Response<TGet_Media_PreSignedUploadUrl_ResponseDTO>
) {
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
    uploadUrl,
    key: finalKey,
  });
}

getPreSignedUploadUrl.validator = [
  query('contentType').notEmpty().isString(),
  query('scope').notEmpty().isString(),
  query('overwrite').optional().isBoolean(),
  query('key').optional().isString(),
];

export async function getPreSignedDownloadUrl(
  req: express.Request<TGet_Media_PreSignedDownloadUrl_ParamsDTO>,
  res: express.Response<TGet_Media_PreSignedDownloadUrl_ResponseDTO>
) {
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
}

getPreSignedDownloadUrl.validator = [param('key').notEmpty().isString()];
