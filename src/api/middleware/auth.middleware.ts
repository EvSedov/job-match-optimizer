import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширение типа Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware для проверки аутентификации
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Получение токена из заголовка
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Отсутствует токен авторизации',
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Проверка токена
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };

    // Добавление пользователя в запрос
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Недействительный токен авторизации',
      },
    });
  }
}
