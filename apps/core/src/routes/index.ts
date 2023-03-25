import { Router } from 'express';
import { controllerWrapper } from '../core/utils/controller-wrapper';
import { getInfo } from './root.controller';
import v1Routes from './v1';

const router: Router = Router();

router.use('/v1', v1Routes);
router.get('/', controllerWrapper(getInfo));

export default router;
