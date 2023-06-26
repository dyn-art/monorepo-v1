import { Router } from 'express';
import { controllerWrapper } from '../../../core/utils';
import {
  getPreSignedDownloadUrl,
  getPreSignedUploadUrl,
} from './media.controller';

const router: Router = Router();

router.get(
  '/pre-signed-upload-url',
  ...getPreSignedUploadUrl.validator,
  controllerWrapper(getPreSignedUploadUrl)
);

router.get(
  '/pre-signed-download-url/:key',
  ...getPreSignedDownloadUrl.validator,
  controllerWrapper(getPreSignedDownloadUrl)
);

export default router;
