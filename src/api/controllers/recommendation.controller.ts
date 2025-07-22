import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../../services/recommendation.service';
import { ProfileService } from '../../services/profile.service';
import { JobService } from '../../services/job.service';
import { GenerateRecommendationsRequest } from '../../models/recommendation.model';

/**
 * Контроллер для работы с рекомендациями
 */
export class RecommendationController {
  constructor(
    private recommendationService: RecommendationService,
    private profileService: ProfileService,
    private jobService: JobService
  ) {}

  /**
   * Генерация рекомендаций по улучшению профиля
   */
  async generateRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const recommendations = await this.recommendationService.generateRecommendations(
        profile.id,
        jobId
      );

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Генерация рекомендаций с дополнительными параметрами
   */
  async generateRecommendationsWithOptions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const requestData: GenerateRecommendationsRequest = req.body;
      const { profileId, jobId } = requestData;

      // Проверка, что профиль принадлежит пользователю
      const profile = await this.profileService.getProfile(profileId);

      if (!profile || profile.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Доступ к профилю запрещен или профиль не найден',
          },
        });
        return;
      }

      // Проверка, что вакансия принадлежит пользователю
      const job = await this.jobService.getJob(jobId);

      if (!job || job.userId !== userId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Доступ к вакансии запрещен или вакансия не найдена',
          },
        });
        return;
      }

      const recommendations =
        await this.recommendationService.generateRecommendationsWithOptions(requestData);

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение рекомендаций для профиля
   */
  async getRecommendationsForProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const recommendations = await this.recommendationService.getRecommendationsForProfile(
        profile.id
      );

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение рекомендаций для пары профиль-вакансия
   */
  async getRecommendationsForProfileAndJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const recommendations = await this.recommendationService.getRecommendationsForProfileAndJob(
        profile.id,
        jobId
      );

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Отметить рекомендацию как выполненную
   */
  async markRecommendationAsCompleted(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const { recommendationId } = req.params;
      const updatedRecommendation =
        await this.recommendationService.markRecommendationAsCompleted(recommendationId);

      res.status(200).json({
        success: true,
        data: updatedRecommendation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Отметить рекомендацию как отклоненную
   */
  async markRecommendationAsRejected(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const { recommendationId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PARAMETERS',
            message: 'Необходимо указать причину отклонения',
          },
        });
        return;
      }

      const updatedRecommendation = await this.recommendationService.markRecommendationAsRejected(
        recommendationId,
        reason
      );

      res.status(200).json({
        success: true,
        data: updatedRecommendation,
      });
    } catch (error) {
      next(error);
    }
  }
}
