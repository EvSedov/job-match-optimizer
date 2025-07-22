/**
 * Интерфейс для базовой обработки текста
 */
export interface TextProcessor {
  /**
   * Очистка текста от HTML тегов и специальных символов
   * @param text - исходный текст
   * @returns очищенный текст
   */
  cleanText(text: string): string;

  /**
   * Токенизация текста на предложения
   * @param text - исходный текст
   * @returns массив предложений
   */
  tokenizeSentences(text: string): string[];

  /**
   * Токенизация текста на слова
   * @param text - исходный текст
   * @returns массив слов
   */
  tokenizeWords(text: string): string[];

  /**
   * Удаление стоп-слов из текста
   * @param tokens - массив токенов
   * @returns массив токенов без стоп-слов
   */
  removeStopwords(tokens: string[]): string[];

  /**
   * Лемматизация токенов
   * @param tokens - массив токенов
   * @param language - язык текста (ru, en)
   * @returns массив лемматизированных токенов
   */
  lemmatize(tokens: string[], language: string): Promise<string[]>;

  /**
   * Определение языка текста
   * @param text - исходный текст
   * @returns код языка (ru, en)
   */
  detectLanguage(text: string): string;

  /**
   * Извлечение ключевых слов из текста
   * @param text - исходный текст
   * @param count - количество ключевых слов
   * @returns массив ключевых слов
   */
  extractKeywords(text: string, count?: number): Promise<string[]>;

  /**
   * Извлечение именованных сущностей (NER)
   * @param text - исходный текст
   * @returns массив именованных сущностей с типами
   */
  extractEntities(text: string): Promise<{ entity: string; type: string }[]>;
}
