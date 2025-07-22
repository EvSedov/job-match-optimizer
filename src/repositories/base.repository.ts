/**
 * Базовый интерфейс репозитория для работы с данными
 */

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}

/**
 * Базовый интерфейс репозитория
 * @template T - тип сущности
 * @template ID - тип идентификатора
 */
export interface BaseRepository<T, ID> {
  /**
   * Найти сущность по идентификатору
   * @param id - идентификатор сущности
   * @returns сущность или null, если не найдена
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Найти все сущности с опциональной фильтрацией
   * @param options - опции запроса (лимит, сортировка, фильтры)
   * @returns массив сущностей
   */
  findAll(options?: QueryOptions): Promise<T[]>;

  /**
   * Создать новую сущность
   * @param entity - данные для создания сущности (без id, createdAt, updatedAt)
   * @returns созданная сущность
   */
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;

  /**
   * Обновить существующую сущность
   * @param id - идентификатор сущности
   * @param updates - частичные данные для обновления
   * @returns обновленная сущность
   */
  update(id: ID, updates: Partial<T>): Promise<T>;

  /**
   * Удалить сущность
   * @param id - идентификатор сущности
   * @returns true, если удаление успешно
   */
  delete(id: ID): Promise<boolean>;

  /**
   * Проверить существование сущности
   * @param id - идентификатор сущности
   * @returns true, если сущность существует
   */
  exists(id: ID): Promise<boolean>;

  /**
   * Подсчитать количество сущностей с опциональной фильтрацией
   * @param filters - фильтры для подсчета
   * @returns количество сущностей
   */
  count(filters?: Record<string, any>): Promise<number>;
}
