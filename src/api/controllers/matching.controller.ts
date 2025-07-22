import { Request, Response, NextFunction } from 'express';
import { MatchingService } from '../../services/matching.service';
import { ProfileService } from '../../services/profile.service';
import { JobService } from '../../services/job.service';

/**
 * Контроллер для работы с сопоставлением профилей и вакансий
 */
export class MatchingController {
  constructor(
    private matchingService: MatchingService,
    private profileService: ProfileService,
    private jobService: JobService
  ) {}

  /**
   * Расчет соответствия профиля требованиям вакансии
   */
  async calculateMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Пользователь не авторизован',
          },
        });
        return;
      }

      const { jobId } = req.params;
      const job = await this.jobService.getJob(jobId);

      if (!job) {
        res.status(404).json({
          success: false,
          error: {
            code: 'JOB_NOT_FOUND',
            message: 'Вакансия не найдена',
          },
        });
        return;
      }

      // Проверка, что вакансия принадлежит пользователю
      if (job.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Доступ запрещен',
          },
        });
        return;
      }

      const profile = await this.profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Профиль не найден',
          },
        });
        return;
      }

      const matchResult = await this.matchingService.calculateMatch(profile.id, jobId);

      res.status(200).json({
        success: true,
        data: matchResult,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение детального анализа соответствия
   */
  async getDetailedAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Пользователь не авторизован',
          },
        });
        return;
      }

      const { jobId } = req.params;
      const job = await this.jobService.getJob(jobId);

      if (!job) {
        res.status(404).json({
          success: false,
          error: {
            code: 'JOB_NOT_FOUND',
            message: 'Вакансия не найдена',
          },
        });
        return;
      }

      // Проверка, что вакансия принадлежит пользователю
      if (job.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Доступ запрещен',
          },
        });
        return;
      }

      const profile = await this.profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Профиль не найден',
          },
        });
        return;
      }

      const detailedAnalysis = await this.matchingService.getDetailedAnalysis(profile.id, jobId);

      res.status(200).json({
        success: true,
        data: detailedAnalysis,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение истории сопоставлений для профиля
   */
  async getProfileMatchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Пользователь не авторизован',
          },
        });
        return;
      }

      const profile = await this.profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Профиль не найден',
          },
        });
        return;
      }

      const matchHistory = await this.matchingService.getProfileMatchHistory(profile.id);

      res.status(200).json({
        success: true,
        data: matchHistory,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение динамики изменения результатов сопоставления
   */
  async getMatchingTrend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Пользователь не авторизован',
          },
        });
        return;
      }

      const { jobId } = req.params;
      const job = await this.jobService.getJob(jobId);

      if (!job) {
        res.status(404).json({
          success: false,
          error: {
            code: 'JOB_NOT_FOUND',
            message: 'Вакансия не найдена',
          },
        });
        return;
      }

      // Проверка, что вакансия принадлежит пользователю
      if (job.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Доступ запрещен',
          },
        });
        return;
      }

      const profile = await this.profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Профиль не найден',
          },
        });
        return;
      }

      const trend = await this.matchingService.getMatchingTrend(profile.id, jobId);

      res.status(200).json({
        success: true,
        data: trend,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Сравнение нескольких вакансий для профиля
   */
  async compareJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Пользователь не авторизован',
          },
        });
        return;
      }

      const { jobIds } = req.body;

      if (!Array.isArray(jobIds) || jobIds.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PARAMETERS',
            message: 'Необходимо указать массив идентификаторов вакансий',
          },
        });
        return;
      }

      const profile = await this.profileService.getProfileByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Профиль не найден',
          },
        });
        return;
      }

      // Проверка, что все вакансии принадлежат пользователю
      for (const jobId of jobIds) {
        const job = await this.jobService.getJob(jobId);

        if (!job || job.userId !== userId) {
          res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: `Доступ к вакансии ${jobId} запрещен или вакансия не найдена`,
            },
          });
          return;
        }
      }

      const comparison = await this.matchingService.compareJobs(profile.id, jobIds);

      res.status(200).json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  }
}
