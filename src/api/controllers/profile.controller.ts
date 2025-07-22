import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../../services/profile.service';
import { CreateProfileRequest, UpdateProfileRequest } from '../../models/profile.model';

/**
 * Контроллер для работы с профилями
 */
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  /**
   * Создание нового профиля
   */
  async createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const profileData: CreateProfileRequest = req.body;
      const profile = await this.profileService.createProfile(userId, profileData);

      res.status(201).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение профиля пользователя
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление профиля
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const updates: UpdateProfileRequest = req.body;
      const updatedProfile = await this.profileService.updateProfile(profile.id, updates);

      res.status(200).json({
        success: true,
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление текста резюме
   */
  async updateResumeText(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { resumeText } = req.body;
      const updatedProfile = await this.profileService.updateResumeText(profile.id, resumeText);

      res.status(200).json({
        success: true,
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Парсинг текста резюме без сохранения
   */
  async parseResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resumeText } = req.body;
      const parsedProfile = await this.profileService.parseResume(resumeText);

      res.status(200).json({
        success: true,
        data: parsedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение истории изменений профиля
   */
  async getProfileHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const history = await this.profileService.getProfileHistory(profile.id);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}
