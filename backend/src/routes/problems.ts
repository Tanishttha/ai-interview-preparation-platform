import { Router } from 'express';

export function createProblemRoutes() {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({ problems: [] });
  });

  router.get('/:slug', (req, res) => {
    res.json({ problem: { slug: req.params.slug } });
  });

  return router;
}
