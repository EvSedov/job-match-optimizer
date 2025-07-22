/**
 * Утилиты для обработки текста
 */

/**
 * Очистка текста от HTML тегов
 * @param text - исходный текст
 * @returns очищенный текст
 */
export function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Нормализация пробелов в тексте
 * @param text - исходный текст
 * @returns текст с нормализованными пробелами
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Проверка размера текста
 * @param text - исходный текст
 * @param maxSize - максимальный размер в байтах
 * @returns true, если размер текста не превышает максимальный
 */
export function checkTextSize(text: string, maxSize: number): boolean {
  return Buffer.byteLength(text, 'utf8') <= maxSize;
}

/**
 * Обрезка текста до максимальной длины с добавлением многоточия
 * @param text - исходный текст
 * @param maxLength - максимальная длина
 * @returns обрезанный текст
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Разбиение текста на предложения
 * @param text - исходный текст
 * @returns массив предложений
 */
export function splitSentences(text: string): string[] {
  // Регулярное выражение для разбиения на предложения с учетом сокращений
  const sentenceRegex = /[^.!?]+[.!?]+/g;
  const sentences = text.match(sentenceRegex) || [];
  return sentences.map(s => s.trim());
}

/**
 * Разбиение текста на абзацы
 * @param text - исходный текст
 * @returns массив абзацев
 */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Извлечение списков из текста
 * @param text - исходный текст
 * @returns массив элементов списка
 */
export function extractListItems(text: string): string[] {
  // Регулярное выражение для поиска элементов списка
  const listItemRegex = /(?:^|\n)[-•*]\s+(.+?)(?=\n[-•*]|\n\n|$)/gs;
  const matches = [...text.matchAll(listItemRegex)];
  return matches.map(match => match[1].trim());
}

/**
 * Определение языка текста (простая эвристика)
 * @param text - исходный текст
 * @returns код языка (ru, en)
 */
export function detectLanguage(text: string): string {
  // Упрощенная эвристика на основе частоты символов кириллицы
  const cyrillicPattern = /[\u0400-\u04FF]/g;
  const cyrillicMatches = text.match(cyrillicPattern) || [];
  const cyrillicRatio = cyrillicMatches.length / text.length;

  return cyrillicRatio > 0.3 ? 'ru' : 'en';
}
