import { Router } from 'express';

export function createProgressRoutes() {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({ solved: 0, attempted: 0 });
  });

  router.post('/', (_req, res) => {
    res.json({ ok: true });
  });

  return router;
}
