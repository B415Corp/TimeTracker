# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install all dependencies (including devDependencies for build)
RUN npm ci --workspace=apps/backend

# Copy source code
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine as production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install only production dependencies
RUN npm ci --workspace=apps/backend --only=production && \
    npm cache clean --force

# Copy built application
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/node_modules ./apps/backend/node_modules

WORKDIR /app/apps/backend

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:prod"] 