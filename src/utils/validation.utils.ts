import { z } from 'zod';
import { AppError } from './error-handling.utils';

/**
 * Утилиты для валидации данных
 */

/**
 * Схема валидации для email
 */
export const emailSchema = z
  .string()
  .email('Некорректный формат email')
  .min(5, 'Email должен содержать минимум 5 символов')
  .max(255, 'Email не должен превышать 255 символов');

/**
 * Схема валидации для пароля
 */
export const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .max(100, 'Пароль не должен превышать 100 символов')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    'Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру'
  );

/**
 * Схема валидации для создания пользователя
 */
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Схема валидации для аутентификации
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Пароль не может быть пустым'),
});

/**
 * Схема валидации для изменения пароля
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Текущий пароль не может быть пустым'),
  newPassword: passwordSchema,
});

/**
 * Схема валидации для создания профиля
 */
export const createProfileSchema = z.object({
  resumeText: z.string().min(10, 'Текст резюме должен содержать минимум 10 символов'),
  personalInfo: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      summary: z.string().optional(),
    })
    .optional(),
});

/**
 * Схема валидации для сохранения вакансии
 */
export const saveJobSchema = z.object({
  jobText: z.string().min(10, 'Текст вакансии должен содержать минимум 10 символов'),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

/**
 * Функция валидации данных с использованием схемы Zod
 * @param schema - схема валидации
 * @param data - данные для валидации
 * @returns валидированные данные
 * @throws AppError - ошибка валидации
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      throw AppError.validation('Ошибка валидации данных', details);
    }
    throw error;
  }
}
