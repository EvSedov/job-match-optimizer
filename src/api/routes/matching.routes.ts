import { Router } from 'express';
import { MatchingController } from '../controllers/matching.controller';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * Маршруты для работы с сопоставлением профилей и вакансий
 * @param matchingController - контроллер сопоставления
 */
export function matchingRoutes(matchingController: MatchingController): Router {
  const router = Router();

  // Все маршруты защищены
  router.use(authMiddleware);

  // Маршруты для работы с сопоставлением
  router.get('/jobs/:jobId', (req, res, next) => matchingController.calculateMatch(req, res, next));
  router.get('/jobs/:jobId/detailed', (req, res, next) =>
    matchingController.getDetailedAnalysis(req, res, next)
  );
  router.get('/profile/history', (req, res, next) =>
    matchingController.getProfileMatchHistory(req, res, next)
  );
  router.get('/jobs/:jobId/trend', (req, res, next) =>
    matchingController.getMatchingTrend(req, res, next)
  );
  router.post('/compare-jobs', (req, res, next) => matchingController.compareJobs(req, res, next));

  return router;
}
