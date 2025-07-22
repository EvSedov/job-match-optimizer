import { User } from '../models/user.model';
import { BaseRepository } from './base.repository';

/**
 * Репозиторий для работы с пользователями
 */
export interface UserRepository extends BaseRepository<User, string> {
  /**
   * Найти пользователя по email
   * @param email - email пользователя
   * @returns пользователь или null, если не найден
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Проверить существование пользователя с указанным email
   * @param email - email для проверки
   * @returns true, если пользователь с таким email существует
   */
  emailExists(email: string): Promise<boolean>;

  /**
   * Обновить пароль пользователя
   * @param userId - идентификатор пользователя
   * @param passwordHash - новый хеш пароля
   * @returns обновленный пользователь
   */
  updatePassword(userId: string, passwordHash: string): Promise<User>;
}
