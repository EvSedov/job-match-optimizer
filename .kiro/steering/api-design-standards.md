---
inclusion: fileMatch
fileMatchPattern: "*api*"
---

# Стандарты проектирования API

## REST API принципы

### Структура URL

- Использовать существительные во множественном числе
- Избегать глаголов в URL (действие определяется HTTP методом)
- Использовать иерархическую структуру для связанных ресурсов

#### Примеры URL структур

```
GET    /api/v1/profiles              # Получить список профилей
GET    /api/v1/profiles/{id}         # Получить конкретный профиль
POST   /api/v1/profiles              # Создать новый профиль
PUT    /api/v1/profiles/{id}         # Обновить профиль
DELETE /api/v1/profiles/{id}         # Удалить профиль

GET    /api/v1/jobs                  # Получить список вакансий
POST   /api/v1/jobs                  # Добавить вакансию
GET    /api/v1/jobs/{id}/match       # Получить анализ соответствия
POST   /api/v1/profiles/{id}/analyze # Анализировать профиль
```

### HTTP методы и статус коды

#### Использование методов

- **GET**: Получение данных (идемпотентный)
- **POST**: Создание ресурсов, выполнение операций
- **PUT**: Полное обновление ресурса (идемпотентный)
- **PATCH**: Частичное обновление ресурса
- **DELETE**: Удаление ресурса (идемпотентный)

#### Стандартные статус коды

- **200 OK**: Успешный запрос
- **201 Created**: Ресурс создан
- **204 No Content**: Успешно, но нет содержимого
- **400 Bad Request**: Некорректный запрос
- **401 Unauthorized**: Требуется аутентификация
- **403 Forbidden**: Доступ запрещен
- **404 Not Found**: Ресурс не найден
- **422 Unprocessable Entity**: Ошибка валидации
- **500 Internal Server Error**: Внутренняя ошибка сервера

### Форматы запросов и ответов

#### Структура ответа

```typescript
// Успешный ответ
{
  "success": true,
  "data": {
    // Данные ответа
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0"
  }
}

// Ответ с ошибкой
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Некорректные данные профиля",
    "details": [
      {
        "field": "email",
        "message": "Некорректный формат email"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0"
  }
}
```

#### Пагинация

```typescript
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Валидация данных

#### Входные данные

- Валидировать все параметры запроса
- Использовать схемы валидации (JSON Schema, Joi)
- Возвращать детальные сообщения об ошибках
- Санитизировать входные данные

#### Примеры валидации

```typescript
// Валидация профиля
const profileSchema = {
  email: { type: "string", format: "email", required: true },
  skills: {
    type: "array",
    items: { type: "string" },
    maxItems: 50,
  },
  experience: {
    type: "array",
    items: {
      type: "object",
      properties: {
        company: { type: "string", required: true },
        position: { type: "string", required: true },
        duration: { type: "number", minimum: 0 },
      },
    },
  },
};
```

### Безопасность API

#### Аутентификация

- Использовать JWT токены для аутентификации
- Реализовать refresh token механизм
- Устанавливать разумные сроки жизни токенов

#### Авторизация

- Проверять права доступа к ресурсам
- Пользователи могут работать только со своими данными
- Логировать попытки несанкционированного доступа

#### Защита от атак

- Rate limiting для предотвращения злоупотреблений
- CORS настройки для веб-приложений
- Валидация размера загружаемых данных
- Защита от SQL injection и XSS

### Документация API

#### OpenAPI спецификация

- Документировать все endpoints
- Описывать схемы запросов и ответов
- Включать примеры использования
- Указывать коды ошибок и их значения

#### Примеры документации

```yaml
/api/v1/profiles/{id}/analyze:
  post:
    summary: Анализ профиля пользователя
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/AnalysisRequest"
    responses:
      200:
        description: Результат анализа
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AnalysisResult"
```

### Мониторинг и логирование

#### Метрики API

- Время ответа endpoints
- Количество запросов в секунду
- Частота ошибок по типам
- Использование ресурсов

#### Логирование

- Логировать все API запросы
- Включать correlation ID для трассировки
- Не логировать чувствительные данные
- Структурированные логи в JSON формате
