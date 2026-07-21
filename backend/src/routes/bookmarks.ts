import { Router } from 'express';

export function createBookmarkRoutes() {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({ bookmarks: [] });
  });

  router.post('/', (_req, res) => {
    res.json({ ok: true });
  });

  router.delete('/:id', (req, res) => {
    res.json({ id: req.params.id, deleted: true });
  });

  return router;
}
