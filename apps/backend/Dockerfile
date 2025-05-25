# Этап сборки frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY apps/frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY apps/frontend ./
RUN npm run build

# Этап сборки backend
FROM node:20-bookworm-slim AS backend-builder

WORKDIR /app/backend

# Установка зависимостей для компиляции
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Установка зависимостей
COPY apps/backend/package*.json ./
RUN npm install --force --legacy-peer-deps

# Копирование исходного кода и сборка
COPY apps/backend ./
RUN npm run build

# Финальный образ
FROM node:20-bookworm-slim

WORKDIR /app/backend

# Копируем только необходимые файлы
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./dist/public

# Фиксируем архитектуру модулей
RUN npm rebuild bcrypt --update-binary

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
