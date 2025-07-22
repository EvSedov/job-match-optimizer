import { ParsedJob, JobRequirement } from '../models/job.model';
import { ImportanceLevel, RequirementType } from '../models/common.types';

/**
 * Интерфейс для парсинга вакансий
 */
export interface JobParser {
  /**
   * Парсинг текста вакансии
   * @param text - текст вакансии
   * @returns структурированные данные вакансии
   */
  parseJobDescription(text: string): Promise<ParsedJob>;

  /**
   * Извлечение заголовка вакансии
   * @param text - текст вакансии
   * @returns заголовок вакансии
   */
  extractJobTitle(text: string): Promise<string>;

  /**
   * Извлечение названия компании
   * @param text - текст вакансии
   * @returns название компании
   */
  extractCompany(text: string): Promise<string>;

  /**
   * Извлечение местоположения
   * @param text - текст вакансии
   * @returns местоположение
   */
  extractLocation(text: string): Promise<string | undefined>;

  /**
   * Извлечение информации о зарплате
   * @param text - текст вакансии
   * @returns информация о зарплате
   */
  extractSalary(text: string): Promise<
    | {
        min?: number;
        max?: number;
        currency: string;
      }
    | undefined
  >;

  /**
   * Извлечение требований
   * @param text - текст вакансии
   * @returns массив требований
   */
  extractRequirements(text: string): Promise<JobRequirement[]>;

  /**
   * Извлечение обязанностей
   * @param text - текст вакансии
   * @returns массив обязанностей
   */
  extractResponsibilities(text: string): Promise<string[]>;

  /**
   * Извлечение преимуществ
   * @param text - текст вакансии
   * @returns массив преимуществ
   */
  extractBenefits(text: string): Promise<string[]>;

  /**
   * Определение важности требования
   * @param requirementContext - контекст упоминания требования
   * @returns уровень важности
   */
  determineImportanceLevel(requirementContext: string): ImportanceLevel;

  /**
   * Определение типа требования
   * @param requirement - текст требования
   * @returns тип требования
   */
  determineRequirementType(requirement: string): RequirementType;

  /**
   * Определение обязательности требования
   * @param requirementContext - контекст упоминания требования
   * @returns true, если требование обязательное
   */
  isRequirementMandatory(requirementContext: string): boolean;
}
