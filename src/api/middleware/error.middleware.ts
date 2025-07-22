import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { AppError, ErrorCode } from '../../utils/error-handling.utils';

/**
 * Middleware для обработки ошибок
 */
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Логирование ошибки
  logger.error(`Error: ${error.message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  // Если это наша кастомная ошибка
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  // Для ошибок валидации Zod
  if (error.name === 'ZodError') {
    res.status(400).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Ошибка валидации данных',
        details: error.message,
      },
    });
    return;
  }

  // Для ошибок JWT
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        code: ErrorCode.INVALID_TOKEN,
        message: 'Недействительный токен авторизации',
      },
    });
    return;
  }

  // Для остальных ошибок
  res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Внутренняя ошибка сервера',
    },
  });
}
