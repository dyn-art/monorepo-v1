import { controllerWrapper } from '@/core/utils';
import { Router } from 'express';
import {
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

export default router;
