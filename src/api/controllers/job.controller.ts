import { Request, Response, NextFunction } from 'express';
import { JobService } from '../../services/job.service';
import { SaveJobRequest } from '../../models/job.model';

/**
 * Контроллер для работы с вакансиями
 */
export class JobController {
  constructor(private jobService: JobService) {}

  /**
   * Сохранение новой вакансии
   */
  async saveJob(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const jobData: SaveJobRequest = req.body;
      const savedJob = await this.jobService.saveJob(userId, jobData);

      res.status(201).json({
        success: true,
        data: savedJob,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение всех вакансий пользователя
   */
  async getUserJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const jobs = await this.jobService.getUserJobs(userId);

      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение вакансии по идентификатору
   */
  async getJob(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const jobId = req.params.id;
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

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление вакансии
   */
  async updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const jobId = req.params.id;
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

      const updates: Partial<SaveJobRequest> = req.body;
      const updatedJob = await this.jobService.updateJob(jobId, updates);

      res.status(200).json({
        success: true,
        data: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Удаление вакансии
   */
  async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const jobId = req.params.id;
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

      await this.jobService.deleteJob(jobId);

      res.status(200).json({
        success: true,
        data: {
          message: 'Вакансия успешно удалена',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Парсинг текста вакансии без сохранения
   */
  async parseJobDescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobText } = req.body;
      const parsedJob = await this.jobService.parseJobDescription(jobText);

      res.status(200).json({
        success: true,
        data: parsedJob,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Поиск вакансий по ключевым словам
   */
  async searchJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { keywords } = req.query;

      if (!keywords || typeof keywords !== 'string') {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PARAMETERS',
            message: 'Необходимо указать ключевые слова для поиска',
          },
        });
        return;
      }

      const keywordArray = keywords.split(',').map(k => k.trim());
      const jobs = await this.jobService.searchJobs(userId, keywordArray);

      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление тегов вакансии
   */
  async updateTags(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const jobId = req.params.id;
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

      const { tags } = req.body;
      const updatedJob = await this.jobService.updateTags(jobId, tags);

      res.status(200).json({
        success: true,
        data: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  }
}
