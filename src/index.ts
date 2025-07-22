/**
 * Главная точка входа в приложение оптимизации поиска работы
 */

// Экспорт всех основных модулей
export * from "./models";
export * from "./services";
export * from "./repositories";
export * from "./api";
export * from "./utils";
export * from "./nlp";

// Версия приложения
export const VERSION = "1.0.0";

// Конфигурация по умолчанию
export const DEFAULT_CONFIG = {
  MAX_RESUME_SIZE: 50 * 1024, // 50KB
  MAX_JOB_DESCRIPTION_SIZE: 20 * 1024, // 20KB
  DEFAULT_TIMEOUT: 30000, // 30 секунд
  CACHE_TTL: 3600, // 1 час
  SUPPORTED_LANGUAGES: ["ru", "en"],
} as const;
