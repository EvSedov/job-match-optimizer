import { SavedJob, ParsedJob, SaveJobRequest } from '../models/job.model';

/**
 * Сервис для работы с вакансиями
 */
export interface JobService {
  /**
   * Парсинг текста вакансии и извлечение структурированных данных
   * @param jobText - текст описания вакансии
   * @returns структурированные данные вакансии
   */
  parseJobDescription(jobText: string): Promise<ParsedJob>;

  /**
   * Получить вакансию по идентификатору
   * @param jobId - идентификатор вакансии
   * @returns вакансия или null, если не найдена
   */
  getJob(jobId: string): Promise<SavedJob | null>;

  /**
   * Получить все вакансии пользователя
   * @param userId - идентификатор пользователя
   * @returns массив вакансий пользователя
   */
  getUserJobs(userId: string): Promise<SavedJob[]>;

  /**
   * Сохранить новую вакансию
   * @param userId - идентификатор пользователя
   * @param jobData - данные для сохранения вакансии
   * @returns сохраненная вакансия
   */
  saveJob(userId: string, jobData: SaveJobRequest): Promise<SavedJob>;

  /**
   * Обновить существующую вакансию
   * @param jobId - идентификатор вакансии
   * @param updates - данные для обновления
   * @returns обновленная вакансия
   */
  updateJob(jobId: string, updates: Partial<SaveJobRequest>): Promise<SavedJob>;

  /**
   * Удалить вакансию
   * @param jobId - идентификатор вакансии
   * @returns true, если удаление успешно
   */
  deleteJob(jobId: string): Promise<boolean>;

  /**
   * Поиск вакансий по ключевым словам
   * @param userId - идентификатор пользователя
   * @param keywords - ключевые слова для поиска
   * @returns массив найденных вакансий
   */
  searchJobs(userId: string, keywords: string[]): Promise<SavedJob[]>;

  /**
   * Найти похожие вакансии
   * @param jobId - идентификатор вакансии
   * @param limit - максимальное количество результатов
   * @returns массив похожих вакансий
   */
  findSimilarJobs(jobId: string, limit: number): Promise<SavedJob[]>;

  /**
   * Обновить теги вакансии
   * @param jobId - идентификатор вакансии
   * @param tags - новые теги
   * @returns обновленная вакансия
   */
  updateTags(jobId: string, tags: string[]): Promise<SavedJob>;
}
