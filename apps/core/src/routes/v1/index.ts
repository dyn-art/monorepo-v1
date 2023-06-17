import { Router } from 'express';
import authRoutes from './auth';
import mediaRoutes from './media';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.get('/ping', (req, res, nex) => {
  res.send(200);
});

export default router;
