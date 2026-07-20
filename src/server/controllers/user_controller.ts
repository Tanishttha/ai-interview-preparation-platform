import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { UserRepository } from '../repositories/user_repository';

const userRepository = new UserRepository();

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'candidate-default-id';
    try {
      const profile = await userRepository.getProfile(userId);
      res.json(profile);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'candidate-default-id';
    try {
      const updated = await userRepository.updateProfile(userId, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getDashboardMetrics(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'candidate-default-id';
    try {
      const profile = await userRepository.getProfile(userId);
      res.json({
        xp: profile?.xp ?? 2150,
        completedRounds: profile?.completedRounds ?? 4,
        targetRole: profile?.targetRole || "Software Engineer",
        targetSalary: profile?.targetSalary || "18-24 LPA",
        dailyStreak: profile?.dailyStreak ?? 5,
        weeklyGoalMet: true,
        streakClaimed: profile?.streakClaimed ?? false
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
