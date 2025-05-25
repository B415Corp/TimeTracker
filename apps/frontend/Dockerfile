# Dockerfile для сборки фронтенда
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Собранный фронтенд будет в папке /app/dist
