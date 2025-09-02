import { Router } from 'express';
import { readFile } from 'fs/promises';
import { ethers } from 'ethers';

const router = Router();

router.get('/:symbol/:id', async (req, res, next) => {
  try {
    const data = await readFile(`./mock/collections/${req.params.symbol}/${req.params.id}.png`);
    res.contentType('image/png').send(Buffer.from(data, 'base64'));
  } catch (e) {
    res.status(404).json({ message: 'NOT_FOUND' });
  }
});

export default router;
