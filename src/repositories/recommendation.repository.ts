import { Recommendation } from '../models/recommendation.model';
import { BaseRepository } from './base.repository';
import { RecommendationType, Priority } from '../models/common.types';

/**
 * Репозиторий для работы с рекомендациями
 */
export interface RecommendationRepository extends BaseRepository<Recommendation, string> {
  /**
   * Найти рекомендации по идентификатору профиля
   * @param profileId - идентификатор профиля
   * @returns массив рекомендаций
   */
  findByProfileId(profileId: string): Promise<Recommendation[]>;

  /**
   * Найти рекомендации по идентификатору вакансии
   * @param jobId - идентификатор вакансии
   * @returns массив рекомендаций
   */
  findByJobId(jobId: string): Promise<Recommendation[]>;

  /**
   * Найти рекомендации для пары профиль-вакансия
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns массив рекомендаций
   */
  findByProfileAndJob(profileId: string, jobId: string): Promise<Recommendation[]>;

  /**
   * Найти рекомендации по типу
   * @param type - тип рекомендации
   * @returns массив рекомендаций указанного типа
   */
  findByType(type: RecommendationType): Promise<Recommendation[]>;

  /**
   * Найти рекомендации по приоритету
   * @param priority - приоритет рекомендации
   * @returns массив рекомендаций с указанным приоритетом
   */
  findByPriority(priority: Priority): Promise<Recommendation[]>;

  /**
   * Отметить рекомендацию как выполненную
   * @param recommendationId - идентификатор рекомендации
   * @param completedAt - дата выполнения
   * @returns обновленная рекомендация
   */
  markAsCompleted(recommendationId: string, completedAt: Date): Promise<Recommendation>;

  /**
   * Отметить рекомендацию как отклоненную
   * @param recommendationId - идентификатор рекомендации
   * @param reason - причина отклонения
   * @returns обновленная рекомендация
   */
  markAsRejected(recommendationId: string, reason: string): Promise<Recommendation>;
}
