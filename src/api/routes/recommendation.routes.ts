import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * Маршруты для работы с рекомендациями
 * @param recommendationController - контроллер рекомендаций
 */
export function recommendationRoutes(recommendationController: RecommendationController): Router {
  const router = Router();

  // Все маршруты защищены
  router.use(authMiddleware);

  // Маршруты для работы с рекомендациями
  router.get('/profile', (req, res, next) =>
    recommendationController.getRecommendationsForProfile(req, res, next)
  );
  router.get('/jobs/:jobId', (req, res, next) =>
    recommendationController.getRecommendationsForProfileAndJob(req, res, next)
  );
  router.post('/jobs/:jobId/generate', (req, res, next) =>
    recommendationController.generateRecommendations(req, res, next)
  );
  router.post('/generate-with-options', (req, res, next) =>
    recommendationController.generateRecommendationsWithOptions(req, res, next)
  );
  router.put('/:recommendationId/complete', (req, res, next) =>
    recommendationController.markRecommendationAsCompleted(req, res, next)
  );
  router.put('/:recommendationId/reject', (req, res, next) =>
    recommendationController.markRecommendationAsRejected(req, res, next)
  );

  return router;
}
