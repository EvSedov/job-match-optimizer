import { User, CreateUserRequest, UserResponse } from '../models/user.model';

/**
 * Сервис для работы с пользователями
 */
export interface UserService {
  /**
   * Регистрация нового пользователя
   * @param userData - данные для создания пользователя
   * @returns созданный пользователь
   */
  registerUser(userData: CreateUserRequest): Promise<UserResponse>;

  /**
   * Аутентификация пользователя
   * @param email - email пользователя
   * @param password - пароль пользователя
   * @returns токен доступа или null при неудачной аутентификации
   */
  authenticateUser(email: string, password: string): Promise<string | null>;

  /**
   * Получить пользователя по идентификатору
   * @param userId - идентификатор пользователя
   * @returns пользователь или null, если не найден
   */
  getUserById(userId: string): Promise<UserResponse | null>;

  /**
   * Получить пользователя по email
   * @param email - email пользователя
   * @returns пользователь или null, если не найден
   */
  getUserByEmail(email: string): Promise<UserResponse | null>;

  /**
   * Обновить данные пользователя
   * @param userId - идентификатор пользователя
   * @param updates - данные для обновления
   * @returns обновленный пользователь
   */
  updateUser(userId: string, updates: Partial<User>): Promise<UserResponse>;

  /**
   * Изменить пароль пользователя
   * @param userId - идентификатор пользователя
   * @param currentPassword - текущий пароль
   * @param newPassword - новый пароль
   * @returns true, если пароль успешно изменен
   */
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;

  /**
   * Удалить пользователя
   * @param userId - идентификатор пользователя
   * @returns true, если удаление успешно
   */
  deleteUser(userId: string): Promise<boolean>;

  /**
   * Проверить существование пользователя с указанным email
   * @param email - email для проверки
   * @returns true, если пользователь с таким email существует
   */
  emailExists(email: string): Promise<boolean>;
}
