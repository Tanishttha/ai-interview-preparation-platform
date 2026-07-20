import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AnalyticsRepository } from '../repositories/analytics_repository';

const analyticsRepository = new AnalyticsRepository();

export class AnalyticsController {
  async getUserProgress(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'candidate-default-id';
    try {
      const data = await analyticsRepository.getProgressByUserId(userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getLeaderboard(req: AuthenticatedRequest, res: Response) {
    try {
      const leaderboard = await analyticsRepository.getLeaderboard();
      res.json(leaderboard);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
