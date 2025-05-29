.PHONY: help build up down restart logs clean status

# Цвета для вывода
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

help: ## Показать справку
	@echo "$(GREEN)TimeTracker Docker Commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Собрать все контейнеры
	@echo "$(GREEN)🔨 Сборка контейнеров...$(NC)"
	docker-compose build

up: ## Запустить все сервисы
	@echo "$(GREEN)🚀 Запуск сервисов...$(NC)"
	docker-compose up -d

down: ## Остановить все сервисы
	@echo "$(YELLOW)🛑 Остановка сервисов...$(NC)"
	docker-compose down

restart: down up ## Перезапустить все сервисы

logs: ## Показать логи всех сервисов
	docker-compose logs -f

logs-backend: ## Показать логи бэкенда
	docker-compose logs -f backend

logs-frontend: ## Показать логи фронтенда
	docker-compose logs -f frontend

logs-db: ## Показать логи базы данных
	docker-compose logs -f postgres

status: ## Показать статус контейнеров
	@echo "$(GREEN)📊 Статус контейнеров:$(NC)"
	docker-compose ps

clean: ## Полная очистка (контейнеры, образы, volumes)
	@echo "$(RED)🧹 Полная очистка...$(NC)"
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

dev: build up ## Сборка и запуск для разработки
	@echo "$(GREEN)✅ Проект запущен!$(NC)"
	@echo "$(GREEN)🌐 Frontend: http://localhost$(NC)"
	@echo "$(GREEN)🔧 Backend API: http://localhost:3000/v1$(NC)"
	@echo "$(GREEN)🗄️ Adminer: http://localhost:8080$(NC)"

shell-backend: ## Подключиться к контейнеру бэкенда
	docker-compose exec backend sh

shell-frontend: ## Подключиться к контейнеру фронтенда
	docker-compose exec frontend sh

shell-db: ## Подключиться к базе данных
	docker-compose exec postgres psql -U yourusername -d nestdb_prod 