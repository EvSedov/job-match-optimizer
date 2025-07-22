import { Router } from 'express';
import { userRoutes } from './user.routes';
import { profileRoutes } from './profile.routes';
import { jobRoutes } from './job.routes';
import { matchingRoutes } from './matching.routes';
import { recommendationRoutes } from './recommendation.routes';
import {
  UserController,
  ProfileController,
  JobController,
  MatchingController,
  RecommendationController,
} from '../controllers';

/**
 * Создание всех маршрутов API
 * @param controllers - объект с контроллерами
 */
export function createRoutes(controllers: {
  userController: UserController;
  profileController: ProfileController;
  jobController: JobController;
  matchingController: MatchingController;
  recommendationController: RecommendationController;
}): Router {
  const router = Router();

  // Версионирование API
  const apiV1 = Router();
  router.use('/api/v1', apiV1);

  // Подключение маршрутов
  apiV1.use('/users', userRoutes(controllers.userController));
  apiV1.use('/profiles', profileRoutes(controllers.profileController));
  apiV1.use('/jobs', jobRoutes(controllers.jobController));
  apiV1.use('/matching', matchingRoutes(controllers.matchingController));
  apiV1.use('/recommendations', recommendationRoutes(controllers.recommendationController));

  return router;
}
