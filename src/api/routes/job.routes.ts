import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * Маршруты для работы с вакансиями
 * @param jobController - контроллер вакансий
 */
export function jobRoutes(jobController: JobController): Router {
  const router = Router();

  // Все маршруты защищены
  router.use(authMiddleware);

  // Маршруты для работы с вакансиями
  router.post('/', (req, res, next) => jobController.saveJob(req, res, next));
  router.get('/', (req, res, next) => jobController.getUserJobs(req, res, next));
  router.get('/search', (req, res, next) => jobController.searchJobs(req, res, next));
  router.get('/:id', (req, res, next) => jobController.getJob(req, res, next));
  router.put('/:id', (req, res, next) => jobController.updateJob(req, res, next));
  router.delete('/:id', (req, res, next) => jobController.deleteJob(req, res, next));
  router.put('/:id/tags', (req, res, next) => jobController.updateTags(req, res, next));

  // Парсинг вакансии без сохранения
  router.post('/parse', (req, res, next) => jobController.parseJobDescription(req, res, next));

  return router;
}
