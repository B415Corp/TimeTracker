#!/bin/bash

echo "🚀 Тестирование API маршрутов TimeTracker Backend"
echo "================================================="

BASE_URL="http://localhost:3000"

echo ""
echo "1. Проверка health check..."
curl -s "$BASE_URL/health" | jq '.' || echo "Failed"

echo ""
echo "2. Проверка тестового эндпоинта..."
curl -s "$BASE_URL/api/v1/testGet" | jq '.' || echo "Failed"

echo ""
echo "3. Проверка Swagger JSON..."
curl -s "$BASE_URL/docs-json" | jq '.info.title' || echo "Failed"

echo ""
echo "📖 Документация доступна по адресу: $BASE_URL/docs"
echo "" 