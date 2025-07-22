import { SavedJob } from '../models/job.model';
import { BaseRepository } from './base.repository';

/**
 * Репозиторий для работы с вакансиями
 */
export interface JobRepository extends BaseRepository<SavedJob, string> {
  /**
   * Найти вакансии по идентификатору пользователя
   * @param userId - идентификатор пользователя
   * @returns массив вакансий пользователя
   */
  findByUserId(userId: string): Promise<SavedJob[]>;

  /**
   * Поиск вакансий по ключевым словам
   * @param keywords - массив ключевых слов для поиска
   * @returns массив найденных вакансий
   */
  searchByKeywords(keywords: string[]): Promise<SavedJob[]>;

  /**
   * Найти похожие вакансии
   * @param jobId - идентификатор вакансии для поиска похожих
   * @param limit - максимальное количество результатов
   * @returns массив похожих вакансий
   */
  findSimilarJobs(jobId: string, limit: number): Promise<SavedJob[]>;

  /**
   * Обновить теги вакансии
   * @param jobId - идентификатор вакансии
   * @param tags - новый список тегов
   * @returns обновленная вакансия
   */
  updateTags(jobId: string, tags: string[]): Promise<SavedJob>;

  /**
   * Обновить результат последнего сопоставления
   * @param jobId - идентификатор вакансии
   * @param matchScore - новый результат сопоставления
   * @returns обновленная вакансия
   */
  updateLastMatchScore(jobId: string, matchScore: number): Promise<SavedJob>;
}
