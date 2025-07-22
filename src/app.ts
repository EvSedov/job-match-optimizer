import dotenv from 'dotenv';
import { createApp } from './api';
import { logger } from './utils/logger';

// Загрузка переменных окружения
dotenv.config();

// Импорт контроллеров (заглушки для примера)
// В реальном приложении здесь будут импортированы реальные реализации
import {
  UserController,
  ProfileController,
  JobController,
  MatchingController,
  RecommendationController,
} from './api/controllers';

// Создание экземпляров контроллеров
// В реальном приложении здесь будут созданы экземпляры с реальными сервисами
const userController = {} as UserController;
const profileController = {} as ProfileController;
const jobController = {} as JobController;
const matchingController = {} as MatchingController;
const recommendationController = {} as RecommendationController;

// Создание приложения
const app = createApp({
  userController,
  profileController,
  jobController,
  matchingController,
  recommendationController,
});

// Определение порта
const PORT = process.env.PORT || 3000;

// Запуск сервера
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
});
