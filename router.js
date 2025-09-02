import { Router } from 'express';
import metadata from './routes/metadata.js';
import cdn from './routes/cdn.js';

const router = Router();

router.use('/cdn', cdn);
router.use('/nft/v3/:apiKey', metadata);

export default router;
