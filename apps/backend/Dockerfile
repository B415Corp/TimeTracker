# Build stage
FROM node:20-bookworm-slim AS backend-builder

WORKDIR /app/backend

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --force --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app/backend

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./public

# Rebuild native modules
RUN npm rebuild bcrypt --update-binary

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["npm", "run", "start:prod"]