import { expressRouteHandlerWrapper } from '@/core/utils';
import { Router } from 'express';
import { getInfo } from './root.controller';
import v1Routes from './v1';

const router: Router = Router();

router.use('/v1', v1Routes);
router.get('/', expressRouteHandlerWrapper(getInfo));

export default router;
