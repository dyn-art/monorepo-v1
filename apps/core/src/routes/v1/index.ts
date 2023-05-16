import { Router } from 'express';
import authRoutes from './auth';
import mediaRoutes from './media';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);

export default router;
