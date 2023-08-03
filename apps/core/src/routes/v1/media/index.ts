import { controllerWrapper } from '@/core/utils';
import { Router } from 'express';
import {
  getDownloadUrl,
  getFontSource,
  getPreSignedDownloadUrl,
  getPreSignedUploadUrl,
} from './media.controller';

const router: Router = Router();

router.get(
  '/pre-signed-upload-url',
  ...controllerWrapper(getPreSignedUploadUrl)
);

router.get(
  '/pre-signed-download-url/:key',
  ...controllerWrapper(getPreSignedDownloadUrl)
);

router.get('/download-url/:key', ...controllerWrapper(getDownloadUrl));

router.get('/font/source', ...controllerWrapper(getFontSource));

export default router;
