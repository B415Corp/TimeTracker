FROM node:20-alpine AS builder

# Устанавливаем зависимости для сборки
RUN apk add --no-cache --update git python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем
COPY . .
RUN npm run build && ls -la dist

# Финальный образ (можно использовать node или простой веб-сервер)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]
