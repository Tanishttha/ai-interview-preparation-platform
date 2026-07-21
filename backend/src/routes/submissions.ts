import { Router } from 'express';

export function createSubmissionRoutes() {
  const router = Router();

  router.post('/', (_req, res) => {
    res.json({ status: 'Accepted', output: 'Submission recorded' });
  });

  return router;
}
