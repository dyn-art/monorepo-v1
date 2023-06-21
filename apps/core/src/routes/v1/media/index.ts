import { Router } from 'express';
import { controllerWrapper } from '../../../core/utils';
import { getPreSignedUploadUrl } from './media.controller';

const router: Router = Router();

router.get('/pre-signed-upload-url', controllerWrapper(getPreSignedUploadUrl));

export default router;
