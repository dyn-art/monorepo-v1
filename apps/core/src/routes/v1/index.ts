import { TOpenAPIRequest, TOpenAPIResponse } from '@/types';
import { paths } from '@dyn/types/core';
import { Router } from 'express';
import authRoutes from './auth';
import mediaRoutes from './media';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.get(
  '/ping',
  (
    req: TOpenAPIRequest<paths, '/v1/ping', 'get'>,
    res: TOpenAPIResponse<paths, '/v1/ping', 'get'>
  ) => {
    res.status(200).send(true);
  }
);
router.post(
  '/ping',
  (
    req: TOpenAPIRequest<paths, '/v1/ping', 'post'>,
    res: TOpenAPIResponse<paths, '/v1/ping', 'post'>
  ) => {
    const { hello } = req.body;
    res.status(200).send(`Pong ${hello}`);
  }
);

export default router;
