import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createRoutes } from './routes';
import { errorMiddleware } from './middleware';
import { logger } from '../utils/logger';
import {
  UserController,
  ProfileController,
  JobController,
  MatchingController,
  RecommendationController,
} from './controllers';

/**
 * Создание и настройка Express приложения
 * @param controllers - объект с контроллерами
 * @returns настроенное Express приложение
 */
export function createApp(controllers: {
  userController: UserController;
  profileController: ProfileController;
  jobController: JobController;
  matchingController: MatchingController;
  recommendationController: RecommendationController;
}): Express {
  const app = express();

  // Настройка middleware
  app.use(helmet()); // Безопасность
  app.use(cors()); // CORS
  app.use(express.json({ limit: '10mb' })); // Парсинг JSON
  app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Парсинг URL-encoded
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // Логирование запросов

  // Подключение маршрутов
  app.use(createRoutes(controllers));

  // Обработка 404
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Маршрут ${req.path} не найден`,
      },
    });
  });

  // Обработка ошибок
  app.use(errorMiddleware);

  return app;
}
