import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { UtilityController } from '../controllers/utility_controller';

export function createNotesRoutes() {
  const router = Router();
  const controller = new UtilityController();

  router.get('/', authenticateJWT, controller.getNotes.bind(controller));

  router.post('/', authenticateJWT, controller.createNote.bind(controller));

  router.put('/:id', authenticateJWT, controller.updateNote.bind(controller));

  router.delete('/:id', authenticateJWT, controller.deleteNote.bind(controller));

  return router;
}
