import { MatchHistory, MatchResult } from '../models/matching.model';
import { BaseRepository } from './base.repository';

/**
 * Репозиторий для работы с результатами сопоставления
 */
export interface MatchingRepository extends BaseRepository<MatchHistory, string> {
  /**
   * Найти историю сопоставлений по идентификатору профиля
   * @param profileId - идентификатор профиля
   * @returns массив записей истории сопоставлений
   */
  findByProfileId(profileId: string): Promise<MatchHistory[]>;

  /**
   * Найти историю сопоставлений по идентификатору вакансии
   * @param jobId - идентификатор вакансии
   * @returns массив записей истории сопоставлений
   */
  findByJobId(jobId: string): Promise<MatchHistory[]>;

  /**
   * Найти последнее сопоставление для пары профиль-вакансия
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns запись истории сопоставления или null, если не найдена
   */
  findLatestMatch(profileId: string, jobId: string): Promise<MatchHistory | null>;

  /**
   * Сохранить результат сопоставления
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @param matchResult - результат сопоставления
   * @param profileVersion - версия профиля
   * @returns созданная запись истории сопоставления
   */
  saveMatchResult(
    profileId: string,
    jobId: string,
    matchResult: MatchResult,
    profileVersion: number
  ): Promise<MatchHistory>;

  /**
   * Получить динамику изменения результатов сопоставления для профиля
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns массив записей с оценками и датами
   */
  getMatchingTrend(
    profileId: string,
    jobId: string
  ): Promise<{ score: number; date: Date; version: number }[]>;
}
