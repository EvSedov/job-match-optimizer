import { Recommendation, GenerateRecommendationsRequest } from '../models/recommendation.model';

/**
 * Сервис для генерации персонализированных рекомендаций
 */
export interface RecommendationService {
  /**
   * Генерация рекомендаций по улучшению профиля
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns массив рекомендаций
   */
  generateRecommendations(profileId: string, jobId: string): Promise<Recommendation[]>;

  /**
   * Генерация рекомендаций с дополнительными параметрами
   * @param request - параметры запроса
   * @returns массив рекомендаций
   */
  generateRecommendationsWithOptions(
    request: GenerateRecommendationsRequest
  ): Promise<Recommendation[]>;

  /**
   * Приоритизация рекомендаций
   * @param recommendations - массив рекомендаций
   * @returns отсортированный массив рекомендаций по приоритету
   */
  prioritizeRecommendations(recommendations: Recommendation[]): Promise<Recommendation[]>;

  /**
   * Получить рекомендации для профиля
   * @param profileId - идентификатор профиля
   * @returns массив рекомендаций
   */
  getRecommendationsForProfile(profileId: string): Promise<Recommendation[]>;

  /**
   * Получить рекомендации для пары профиль-вакансия
   * @param profileId - идентификатор профиля
   * @param jobId - идентификатор вакансии
   * @returns массив рекомендаций
   */
  getRecommendationsForProfileAndJob(profileId: string, jobId: string): Promise<Recommendation[]>;

  /**
   * Отметить рекомендацию как выполненную
   * @param recommendationId - идентификатор рекомендации
   * @returns обновленная рекомендация
   */
  markRecommendationAsCompleted(recommendationId: string): Promise<Recommendation>;

  /**
   * Отметить рекомендацию как отклоненную
   * @param recommendationId - идентификатор рекомендации
   * @param reason - причина отклонения
   * @returns обновленная рекомендация
   */
  markRecommendationAsRejected(recommendationId: string, reason: string): Promise<Recommendation>;
}
