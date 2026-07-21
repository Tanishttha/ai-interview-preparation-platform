import { Router } from 'express';

export function createDraftRoutes() {
  const router = Router();

  router.get('/:problemId', (req, res) => {
    res.json({ problemId: req.params.problemId, code: '' });
  });

  router.post('/', (_req, res) => {
    res.json({ ok: true });
  });

  router.put('/:id', (req, res) => {
    res.json({ id: req.params.id, updated: true });
  });

  return router;
}
