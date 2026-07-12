import { Router } from 'express';
import prisma from '../../utils/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const assets = await prisma.asset.findMany({ orderBy: { name: 'asc' } });
    res.json(assets);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
