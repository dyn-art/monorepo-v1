import { Router } from 'express';
import etsyRoutes from './etsy';

const router: Router = Router();

router.use('/etsy', etsyRoutes);

export default router;
