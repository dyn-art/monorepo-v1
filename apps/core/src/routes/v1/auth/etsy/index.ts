import { Router } from 'express';
import { controllerWrapper } from '../../../../core/utils/controller-wrapper';
import { STAGE } from '../../../../environment';
import {
  getOAuthChallenge,
  getPing,
  handleOAuthRedirect,
} from './etsy.controller';

const router: Router = Router();

router.get('/ping', controllerWrapper(getPing));
router.get(
  '/oauth/challenge',
  controllerWrapper(getOAuthChallenge, STAGE.LOCAL)
);
router.get(
  '/oauth/redirect',
  controllerWrapper(handleOAuthRedirect, STAGE.LOCAL)
);

export default router;
