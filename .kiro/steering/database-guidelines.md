---
inclusion: fileMatch
fileMatchPattern: "*database*,*repository*,*model*"
---

# Руководство по работе с базой данных

## Принципы проектирования БД

### Структура таблиц

#### Соглашения по именованию

- **Таблицы**: snake_case во множественном числе (`users`, `job_profiles`, `match_results`)
- **Столбцы**: snake_case (`user_id`, `created_at`, `skill_category`)
- **Индексы**: `idx_table_column` (`idx_users_email`, `idx_profiles_user_id`)
- **Внешние ключи**: `fk_table_referenced_table` (`fk_profiles_users`)

#### Обязательные поля

Каждая таблица должна содержать:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### Схема базы данных

#### Основные таблицы

```sql
-- Пользователи
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Профили пользователей
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_text TEXT,
    personal_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Навыки профиля
CREATE TABLE profile_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    skill_category VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Сохраненные вакансии
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    company VARCHAR(255),
    original_text TEXT NOT NULL,
    parsed_requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Результаты сопоставления
CREATE TABLE match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES saved_jobs(id) ON DELETE CASCADE,
    overall_score DECIMAL(5,2) NOT NULL,
    category_scores JSONB,
    matched_skills JSONB,
    missing_requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(profile_id, job_id)
);
```

#### Индексы для производительности

```sql
-- Индексы для частых запросов
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profile_skills_profile_id ON profile_skills(profile_id);
CREATE INDEX idx_profile_skills_category ON profile_skills(skill_category);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_match_results_profile_id ON match_results(profile_id);
CREATE INDEX idx_match_results_job_id ON match_results(job_id);
CREATE INDEX idx_match_results_score ON match_results(overall_score DESC);

-- Полнотекстовый поиск
CREATE INDEX idx_profiles_resume_text ON profiles USING gin(to_tsvector('russian', resume_text));
CREATE INDEX idx_jobs_text_search ON saved_jobs USING gin(to_tsvector('russian', original_text));
```

### Паттерн Repository

#### Базовый интерфейс репозитория

```typescript
interface BaseRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(options?: QueryOptions): Promise<T[]>;
  create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
  filters?: Record<string, any>;
}
```

#### Специализированные репозитории

```typescript
interface ProfileRepository extends BaseRepository<Profile, string> {
  findByUserId(userId: string): Promise<Profile | null>;
  findBySkill(skillName: string): Promise<Profile[]>;
  updateSkills(profileId: string, skills: Skill[]): Promise<void>;
}

interface JobRepository extends BaseRepository<SavedJob, string> {
  findByUserId(userId: string): Promise<SavedJob[]>;
  searchByKeywords(keywords: string[]): Promise<SavedJob[]>;
  findSimilarJobs(jobId: string, limit: number): Promise<SavedJob[]>;
}
```

### Оптимизация запросов

#### Принципы оптимизации

- Использовать подготовленные запросы для предотвращения SQL injection
- Избегать N+1 проблем с помощью JOIN или batch loading
- Использовать пагинацию для больших результатов
- Кэшировать часто используемые запросы

#### Примеры оптимизированных запросов

```sql
-- Получение профиля со всеми навыками (избегаем N+1)
SELECT
    p.*,
    json_agg(
        json_build_object(
            'name', ps.skill_name,
            'category', ps.skill_category,
            'proficiency', ps.proficiency_level,
            'experience', ps.years_of_experience
        )
    ) as skills
FROM profiles p
LEFT JOIN profile_skills ps ON p.id = ps.profile_id
WHERE p.user_id = $1
GROUP BY p.id;

-- Поиск вакансий с полнотекстовым поиском
SELECT *
FROM saved_jobs
WHERE to_tsvector('russian', original_text) @@ plainto_tsquery('russian', $1)
ORDER BY ts_rank(to_tsvector('russian', original_text), plainto_tsquery('russian', $1)) DESC
LIMIT $2 OFFSET $3;
```

### Миграции базы данных

#### Структура миграций

```typescript
interface Migration {
  version: string;
  description: string;
  up: (db: Database) => Promise<void>;
  down: (db: Database) => Promise<void>;
}

// Пример миграции
const migration_001_create_users: Migration = {
  version: "001",
  description: "Create users table",
  up: async (db) => {
    await db.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  },
  down: async (db) => {
    await db.query("DROP TABLE users;");
  },
};
```

### Транзакции и консистентность

#### Использование транзакций

```typescript
// Пример создания профиля с навыками в транзакции
async createProfileWithSkills(
  userId: string,
  profileData: ProfileData,
  skills: Skill[]
): Promise<Profile> {
  return await this.db.transaction(async (trx) => {
    // Создаем профиль
    const profile = await trx.query(
      'INSERT INTO profiles (user_id, resume_text, personal_info) VALUES ($1, $2, $3) RETURNING *',
      [userId, profileData.resumeText, profileData.personalInfo]
    );

    // Добавляем навыки
    for (const skill of skills) {
      await trx.query(
        'INSERT INTO profile_skills (profile_id, skill_name, skill_category, proficiency_level) VALUES ($1, $2, $3, $4)',
        [profile.id, skill.name, skill.category, skill.proficiencyLevel]
      );
    }

    return profile;
  });
}
```

### Мониторинг и производительность

#### Метрики для отслеживания

- Время выполнения запросов
- Количество активных соединений
- Размер кэша запросов
- Частота использования индексов
- Блокировки и deadlock'и

#### Логирование медленных запросов

```sql
-- Настройка PostgreSQL для логирования медленных запросов
SET log_min_duration_statement = 1000; -- логировать запросы > 1 секунды
SET log_statement = 'all'; -- логировать все запросы (только для разработки)
```
