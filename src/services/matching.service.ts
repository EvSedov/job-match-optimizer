import { MatchResult, DetailedMatch } from '../models/matching.model';

/**
 * Сервис для сопоставления профилей с вакансиями
 */
export interface MatchingService {
  /**
   * Рассчитать соответствие профиля требованиям вакансии
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns результат сопоставления
   */
  calculateMatch(profileId: string, jobId: string): Promise<MatchResult>;

  /**
   * Получить детальный анализ соответствия
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns детальный анализ соответствия
   */
  getDetailedAnalysis(profileId: string, jobId: string): Promise<DetailedMatch>;

  /**
   * Получить историю сопоставлений для профиля
   * @param profileId - идентификатор профиля
   * @returns массив результатов сопоставления с разными вакансиями
   */
  getProfileMatchHistory(
    profileId: string
  ): Promise<{ jobId: string; result: MatchResult; date: Date }[]>;

  /**
   * Получить историю сопоставлений для вакансии
   * @param jobId - идентификатор вакансии
   * @returns массив результатов сопоставления с разными профилями
   */
  getJobMatchHistory(
    jobId: string
  ): Promise<{ profileId: string; result: MatchResult; date: Date }[]>;

  /**
   * Получить динамику изменения результатов сопоставления
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns массив оценок с датами
   */
  getMatchingTrend(
    profileId: string,
    jobId: string
  ): Promise<{ score: number; date: Date; version: number }[]>;

  /**
   * Сравнить несколько вакансий для одного профиля
   * @param profileId - идентификатор профиля
   * @param jobIds - массив идентификаторов вакансий
   * @returns массив результатов сопоставления
   */
  compareJobs(
    profileId: string,
    jobIds: string[]
  ): Promise<{ jobId: string; result: MatchResult }[]>;

  /**
   * Сравнить несколько профилей для одной вакансии
   * @param profileIds - массив идентификаторов профилей
   * @param jobId - идентификатор вакансии
   * @returns массив результатов сопоставления
   */
  compareProfiles(
    profileIds: string[],
    jobId: string
  ): Promise<{ profileId: string; result: MatchResult }[]>;
}
