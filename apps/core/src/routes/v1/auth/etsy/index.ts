import { Router } from 'express';
import { controllerWrapper } from '../../../../utils/controller-wrapper';
import {
  getOAuthChallenge,
  getPing,
  handleOAuthRedirect,
} from './etsy.controller';

const router: Router = Router();

router.get('/ping', controllerWrapper(getPing));
router.get('/oauth/challenge', controllerWrapper(getOAuthChallenge));
router.get('/oauth/redirect', controllerWrapper(handleOAuthRedirect));

export default router;
