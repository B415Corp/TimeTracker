#!/bin/bash

# Этот скрипт запускает локальную среду разработки TimeTracker на базе docker-compose.dev.yml
# Он повторяет логику scripts/start-local.sh, но использует конкретный файл docker-compose.dev.yml.
#
# Использование:
#   ./scripts/start-dev.sh            # обычный запуск
#   ./scripts/start-dev.sh --clean    # очистка образов/volumes перед запуском

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

COMPOSE_FILE="docker-compose.dev.yml"

echo -e "${GREEN}🚀 Запуск TimeTracker (dev) с использованием ${COMPOSE_FILE}...${NC}"

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен. Пожалуйста, установите Docker.${NC}"
    exit 1
fi

# Проверка наличия Docker Compose (v2 использует docker compose)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose.${NC}"
    exit 1
fi

# Остановка существующих контейнеров
echo -e "${YELLOW}🛑 Остановка существующих контейнеров...${NC}"
$DOCKER_COMPOSE -f "$COMPOSE_FILE" down

# Очистка старых образов (опционально)
if [ "$1" = "--clean" ]; then
    echo -e "${YELLOW}🧹 Очистка старых образов...${NC}"
    $DOCKER_COMPOSE -f "$COMPOSE_FILE" down --rmi all --volumes --remove-orphans
fi

# Сборка и запуск
echo -e "${YELLOW}🔨 Сборка и запуск контейнеров...${NC}"
$DOCKER_COMPOSE -f "$COMPOSE_FILE" up --build -d

# Ожидание готовности сервисов
echo -e "${YELLOW}⏳ Ожидание готовности сервисов...${NC}"
sleep 10

# Проверка статуса контейнеров
echo -e "${GREEN}📊 Статус контейнеров:${NC}"
$DOCKER_COMPOSE -f "$COMPOSE_FILE" ps

echo -e "${GREEN}✅ Проект запущен!${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}🔧 Backend API: http://localhost:3000/v1${NC}"
echo -e "${GREEN}🗄️  Adminer: http://localhost:8080${NC}"
echo -e "${GREEN}📊 Логи: $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f${NC}"
echo -e "${GREEN}🛑 Остановка: $DOCKER_COMPOSE -f $COMPOSE_FILE down${NC}" 