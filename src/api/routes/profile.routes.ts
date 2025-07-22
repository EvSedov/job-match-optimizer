import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * Маршруты для работы с профилями
 * @param profileController - контроллер профилей
 */
export function profileRoutes(profileController: ProfileController): Router {
  const router = Router();

  // Все маршруты защищены
  router.use(authMiddleware);

  // Маршруты для работы с профилем
  router.post('/', (req, res, next) => profileController.createProfile(req, res, next));
  router.get('/', (req, res, next) => profileController.getProfile(req, res, next));
  router.put('/', (req, res, next) => profileController.updateProfile(req, res, next));
  router.put('/resume', (req, res, next) => profileController.updateResumeText(req, res, next));
  router.get('/history', (req, res, next) => profileController.getProfileHistory(req, res, next));

  // Парсинг резюме без сохранения
  router.post('/parse', (req, res, next) => profileController.parseResume(req, res, next));

  return router;
}
