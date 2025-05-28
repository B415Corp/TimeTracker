#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Запуск TimeTracker локально...${NC}"

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен. Пожалуйста, установите Docker.${NC}"
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose.${NC}"
    exit 1
fi

# Остановка существующих контейнеров
echo -e "${YELLOW}🛑 Остановка существующих контейнеров...${NC}"
docker-compose down

# Очистка старых образов (опционально)
if [ "$1" = "--clean" ]; then
    echo -e "${YELLOW}🧹 Очистка старых образов...${NC}"
    docker-compose down --rmi all --volumes --remove-orphans
fi

# Сборка и запуск
echo -e "${YELLOW}🔨 Сборка и запуск контейнеров...${NC}"
docker-compose up --build -d

# Ожидание готовности сервисов
echo -e "${YELLOW}⏳ Ожидание готовности сервисов...${NC}"
sleep 10

# Проверка статуса контейнеров
echo -e "${GREEN}📊 Статус контейнеров:${NC}"
docker-compose ps

echo -e "${GREEN}✅ Проект запущен!${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost${NC}"
echo -e "${GREEN}🔧 Backend API: http://localhost:3000/api${NC}"
echo -e "${GREEN}🗄️  Adminer: http://localhost:8080${NC}"
echo -e "${GREEN}📊 Логи: docker-compose logs -f${NC}"
echo -e "${GREEN}🛑 Остановка: docker-compose down${NC}" 