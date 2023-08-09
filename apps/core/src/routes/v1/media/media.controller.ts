import { s3 } from '@/core/aws';
import { TExpressController } from '@/types';
import { randomUUID } from 'crypto';
import { param, query } from 'express-validator';
import { googleService } from '../../../core/services';

export const getPreSignedUploadUrl: TExpressController<
  '/v1/media/pre-signed-upload-url',
  'get'
> = [
  async (req, res) => {
    const { content_type, key, scope, overwrite = false } = req.query;

    // Check whether object already exists
    if (key != null && !overwrite) {
      const exists = await s3.pdaBucket.doesObjectExist(key);
      if (exists) {
        res.sendStatus(200);
        return;
      }
    }

    // Generate presigned upload URL
    const finalKey = typeof key === 'string' ? key : randomUUID();
    const uploadUrl = await s3.pdaBucket.getPreSignedUploadUrl(finalKey, {
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

export const getPreSignedDownloadUrl: TExpressController<
  '/v1/media/pre-signed-download-url/{key}',
  'get'
> = [
  async (req, res) => {
    const { key } = req.params;

    // Check whether object exists
    const exists = await s3.pdaBucket.doesObjectExist(key);
    if (!exists) {
      res.sendStatus(404);
      return;
    }

    // Generate presigned download URL
    const downloadUrl = await s3.pdaBucket.getPreSignedDownloadUrl(key);
    if (downloadUrl == null) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send({ download_url: downloadUrl, key });
  },
  [param('key').notEmpty().isString()],
];

export const getDownloadUrl: TExpressController<
  '/v1/media/download-url/{key}',
  'get'
> = [
  async (req, res) => {
    const { key } = req.params;

    // Check whether object exists
    const exists = await s3.pdaBucket.doesObjectExist(key);
    if (!exists) {
      res.sendStatus(404);
      return;
    }

    // Generate presigned download URL
    const downloadUrl = await s3.pdaBucket.getDownloadUrl(key);
    if (downloadUrl == null) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send({ download_url: downloadUrl, key });
  },
  [param('key').notEmpty().isString()],
];

export const getFontSource: TExpressController<'/v1/media/font/source', 'get'> =
  [
    async (req, res) => {
      const { family, font_weight, style } = req.query;

      // Try to fetch font from google api
      const font = await googleService.downloadFontFile(family, {
        fontWeight: font_weight,
        style,
        capability: 'TTF', // As opentype.js doesn't support WOFF2
      });
      if (font == null) {
        res.status(404).send();
        return;
      }

      const buffer = Buffer.from(font);
      res.contentType('application/octet-stream');
      res.status(200).send(buffer as unknown as string);
    },
    [
      query('family').notEmpty().isString(),
      query('font_weight').optional().isInt(),
      query('style')
        .optional()
        .matches(/^(italic|regular)$/),
    ],
  ];
