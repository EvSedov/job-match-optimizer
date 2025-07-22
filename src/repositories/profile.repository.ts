import { Profile, Skill } from '../models/profile.model';
import { BaseRepository } from './base.repository';

/**
 * Репозиторий для работы с профилями пользователей
 */
export interface ProfileRepository extends BaseRepository<Profile, string> {
  /**
   * Найти профиль по идентификатору пользователя
   * @param userId - идентификатор пользователя
   * @returns профиль или null, если не найден
   */
  findByUserId(userId: string): Promise<Profile | null>;

  /**
   * Найти профили по навыку
   * @param skillName - название навыка
   * @returns массив профилей с указанным навыком
   */
  findBySkill(skillName: string): Promise<Profile[]>;

  /**
   * Обновить навыки профиля
   * @param profileId - идентификатор профиля
   * @param skills - новый список навыков
   * @returns обновленный профиль
   */
  updateSkills(profileId: string, skills: Skill[]): Promise<Profile>;

  /**
   * Обновить текст резюме и пересчитать извлеченные данные
   * @param profileId - идентификатор профиля
   * @param resumeText - новый текст резюме
   * @returns обновленный профиль
   */
  updateResumeText(profileId: string, resumeText: string): Promise<Profile>;

  /**
   * Получить историю версий профиля
   * @param profileId - идентификатор профиля
   * @returns массив версий профиля с датами изменений
   */
  getProfileHistory(profileId: string): Promise<{ version: number; updatedAt: Date }[]>;
}
