# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY ../frontend/package*.json ./
RUN npm install --omit=dev --prefer-offline --no-audit --legacy-peer-deps
COPY ../frontend ./
RUN npm run build

# Stage 2: Build backend
FROM node:16 AS backend-builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Копируем собранный фронтенд в public
COPY --from=frontend-builder /app/frontend/dist ./public
RUN npm run build

# Stage 3: Production image
FROM node:16
WORKDIR /usr/src/app
COPY --from=backend-builder /usr/src/app ./
EXPOSE 3030
CMD ["node", "dist/main"]
