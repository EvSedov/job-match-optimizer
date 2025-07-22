import winston from 'winston';

// Конфигурация логгера
const logConfiguration = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'job-search-optimizer' },
  transports: [
    // Вывод в консоль
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    // Запись в файл
    new winston.transports.File({
      filename: process.env.LOG_FILE || './logs/app.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
};

// Создание логгера
export const logger = winston.createLogger(logConfiguration);

// Добавление обработчика необработанных исключений
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Добавление обработчика необработанных отклонений промисов
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Экспорт функций для удобного логирования
export const logInfo = (message: string, meta?: any): void => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: any): void => {
  logger.error(message, { error });
};

export const logWarn = (message: string, meta?: any): void => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any): void => {
  logger.debug(message, meta);
};
