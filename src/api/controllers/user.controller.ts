import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user.service';
import { CreateUserRequest } from '../../models/user.model';

/**
 * Контроллер для работы с пользователями
 */
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Регистрация нового пользователя
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      const user = await this.userService.registerUser(userData);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Аутентификация пользователя
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.userService.authenticateUser(email, password);

      if (!token) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Неверный email или пароль',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение данных текущего пользователя
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Пользователь не найден',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Изменение пароля пользователя
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { currentPassword, newPassword } = req.body;
      const success = await this.userService.changePassword(userId, currentPassword, newPassword);

      if (!success) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Неверный текущий пароль',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          message: 'Пароль успешно изменен',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
