import {
  Profile,
  ParsedProfile,
  CreateProfileRequest,
  UpdateProfileRequest,
} from '../models/profile.model';

/**
 * Сервис для работы с профилями пользователей
 */
export interface ProfileService {
  /**
   * Парсинг текста резюме и извлечение структурированных данных
   * @param resumeText - текст резюме
   * @returns структурированные данные профиля
   */
  parseResume(resumeText: string): Promise<ParsedProfile>;

  /**
   * Получить профиль по идентификатору
   * @param profileId - идентификатор профиля
   * @returns профиль или null, если не найден
   */
  getProfile(profileId: string): Promise<Profile | null>;

  /**
   * Получить профиль по идентификатору пользователя
   * @param userId - идентификатор пользователя
   * @returns профиль или null, если не найден
   */
  getProfileByUserId(userId: string): Promise<Profile | null>;

  /**
   * Создать новый профиль
   * @param userId - идентификатор пользователя
   * @param profileData - данные для создания профиля
   * @returns созданный профиль
   */
  createProfile(userId: string, profileData: CreateProfileRequest): Promise<Profile>;

  /**
   * Обновить существующий профиль
   * @param profileId - идентификатор профиля
   * @param updates - данные для обновления
   * @returns обновленный профиль
   */
  updateProfile(profileId: string, updates: UpdateProfileRequest): Promise<Profile>;

  /**
   * Обновить текст резюме и пересчитать извлеченные данные
   * @param profileId - идентификатор профиля
   * @param resumeText - новый текст резюме
   * @returns обновленный профиль
   */
  updateResumeText(profileId: string, resumeText: string): Promise<Profile>;

  /**
   * Удалить профиль
   * @param profileId - идентификатор профиля
   * @returns true, если удаление успешно
   */
  deleteProfile(profileId: string): Promise<boolean>;

  /**
   * Получить историю изменений профиля
   * @param profileId - идентификатор профиля
   * @returns история изменений профиля
   */
  getProfileHistory(profileId: string): Promise<{ version: number; updatedAt: Date }[]>;
}
