FROM node:18-alpine AS builder

# Создание рабочей директории
WORKDIR /app

# Копирование package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Установка pnpm
RUN npm install -g pnpm

# Установка зависимостей
RUN pnpm install

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN pnpm build

# Продакшн образ
FROM node:18-alpine AS production

# Создание рабочей директории
WORKDIR /app

# Установка только production зависимостей
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

# Копирование собранного приложения из builder
COPY --from=builder /app/dist ./dist

# Копирование необходимых файлов конфигурации
COPY .env.example .env

# Создание non-root пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Определение порта
EXPOSE 3000

# Проверка работоспособности
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Запуск приложения
CMD ["node", "dist/index.js"]