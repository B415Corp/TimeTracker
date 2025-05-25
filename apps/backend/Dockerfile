# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Собираем проект
RUN npm run build

# Финальный этап
FROM node:20-alpine

WORKDIR /app

# Копируем из builder только необходимые файлы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Запускаем production-сервер
CMD ["npm", "run", "start:prod"]
