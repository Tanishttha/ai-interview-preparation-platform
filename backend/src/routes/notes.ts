import { Router } from 'express';

export function createNotesRoutes() {
  const router = Router();

  router.get('/:problemId', (req, res) => {
    res.json({ problemId: req.params.problemId, content: '' });
  });

  router.post('/', (_req, res) => {
    res.json({ ok: true });
  });

  router.put('/:id', (req, res) => {
    res.json({ id: req.params.id, updated: true });
  });

  router.delete('/:id', (req, res) => {
    res.json({ id: req.params.id, deleted: true });
  });

  return router;
}
