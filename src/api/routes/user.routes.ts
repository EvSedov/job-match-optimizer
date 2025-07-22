import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * Маршруты для работы с пользователями
 * @param userController - контроллер пользователей
 */
export function userRoutes(userController: UserController): Router {
  const router = Router();

  // Публичные маршруты
  router.post('/register', (req, res, next) => userController.register(req, res, next));
  router.post('/login', (req, res, next) => userController.login(req, res, next));

  // Защищенные маршруты
  router.get('/me', authMiddleware, (req, res, next) =>
    userController.getCurrentUser(req, res, next)
  );
  router.post('/change-password', authMiddleware, (req, res, next) =>
    userController.changePassword(req, res, next)
  );

  return router;
}
