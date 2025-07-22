/**
 * Коды ошибок приложения
 */
export enum ErrorCode {
  // Общие ошибки
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Ошибки аутентификации
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  FORBIDDEN = 'FORBIDDEN',

  // Ошибки данных
  DUPLICATE_ENTITY = 'DUPLICATE_ENTITY',
  ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
  INVALID_OPERATION = 'INVALID_OPERATION',

  // Ошибки обработки
  INVALID_RESUME_FORMAT = 'INVALID_RESUME_FORMAT',
  JOB_PARSING_FAILED = 'JOB_PARSING_FAILED',
  MATCHING_SERVICE_UNAVAILABLE = 'MATCHING_SERVICE_UNAVAILABLE',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Кастомная ошибка приложения
 */
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Создать ошибку "Не найдено"
   * @param entity - название сущности
   * @param id - идентификатор
   */
  static notFound(entity: string, id?: string): AppError {
    const message = id ? `${entity} с идентификатором ${id} не найден` : `${entity} не найден`;

    return new AppError(ErrorCode.NOT_FOUND, message, 404);
  }

  /**
   * Создать ошибку "Неавторизован"
   * @param message - сообщение об ошибке
   */
  static unauthorized(message: string = 'Требуется авторизация'): AppError {
    return new AppError(ErrorCode.UNAUTHORIZED, message, 401);
  }

  /**
   * Создать ошибку "Доступ запрещен"
   * @param message - сообщение об ошибке
   */
  static forbidden(message: string = 'Доступ запрещен'): AppError {
    return new AppError(ErrorCode.FORBIDDEN, message, 403);
  }

  /**
   * Создать ошибку "Ошибка валидации"
   * @param message - сообщение об ошибке
   * @param details - детали ошибки
   */
  static validation(message: string, details?: any): AppError {
    return new AppError(ErrorCode.VALIDATION_ERROR, message, 400, details);
  }

  /**
   * Создать ошибку "Дублирование сущности"
   * @param entity - название сущности
   * @param field - поле, по которому произошло дублирование
   * @param value - значение поля
   */
  static duplicate(entity: string, field: string, value: string): AppError {
    return new AppError(
      ErrorCode.DUPLICATE_ENTITY,
      `${entity} с ${field} "${value}" уже существует`,
      409
    );
  }

  /**
   * Создать ошибку "Недопустимая операция"
   * @param message - сообщение об ошибке
   */
  static invalidOperation(message: string): AppError {
    return new AppError(ErrorCode.INVALID_OPERATION, message, 400);
  }

  /**
   * Создать ошибку "Превышен лимит запросов"
   * @param message - сообщение об ошибке
   */
  static rateLimitExceeded(message: string = 'Превышен лимит запросов'): AppError {
    return new AppError(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429);
  }
}
