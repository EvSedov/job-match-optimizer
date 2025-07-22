import { ParsedProfile, Skill, WorkExperience, Education, Language } from '../models/profile.model';

/**
 * Интерфейс для парсинга резюме
 */
export interface ResumeParser {
  /**
   * Парсинг текста резюме
   * @param text - текст резюме
   * @returns структурированные данные профиля
   */
  parseResume(text: string): Promise<ParsedProfile>;

  /**
   * Извлечение персональной информации
   * @param text - текст резюме
   * @returns персональная информация
   */
  extractPersonalInfo(text: string): Promise<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    summary?: string;
  }>;

  /**
   * Извлечение навыков
   * @param text - текст резюме
   * @returns массив навыков
   */
  extractSkills(text: string): Promise<Skill[]>;

  /**
   * Извлечение опыта работы
   * @param text - текст резюме
   * @returns массив опыта работы
   */
  extractWorkExperience(text: string): Promise<WorkExperience[]>;

  /**
   * Извлечение образования
   * @param text - текст резюме
   * @returns массив образования
   */
  extractEducation(text: string): Promise<Education[]>;

  /**
   * Извлечение языков
   * @param text - текст резюме
   * @returns массив языков
   */
  extractLanguages(text: string): Promise<Language[]>;

  /**
   * Определение уровня владения навыком
   * @param skillContext - контекст упоминания навыка
   * @returns уровень владения
   */
  determineProficiencyLevel(skillContext: string): string;

  /**
   * Определение категории навыка
   * @param skill - название навыка
   * @returns категория навыка
   */
  determineSkillCategory(skill: string): string;
}
