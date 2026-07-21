import { Router } from 'express';

export function createExecutionRoutes() {
  const router = Router();

  router.post('/', (_req, res) => {
    res.json({ status: 'completed', output: 'Execution ready' });
  });

  return router;
}
