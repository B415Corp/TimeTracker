# Этап сборки frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY apps/frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY apps/frontend ./
RUN npm run build

# Этап сборки backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY apps/backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY apps/backend ./
RUN npm run build

# Финальный образ
FROM node:20-alpine

WORKDIR /app/backend

# Копируем backend
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package*.json ./

# Копируем собранный frontend из frontend-builder
COPY --from=frontend-builder /app/frontend/dist ./dist/public

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
