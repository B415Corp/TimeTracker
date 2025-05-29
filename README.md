# TimeTracker

Система управления проектами и отслеживания времени с архитектурой монорепозитория.

## 🏗️ Архитектура

- **Frontend**: React 19 + Vite + shadcn/ui + Tailwind CSS
- **Backend**: NestJS 10 + TypeORM + PostgreSQL
- **Database**: PostgreSQL 14
- **Deployment**: Docker + Docker Compose

## 🚀 Быстрый старт

### Предварительные требования

- Docker Desktop
- Docker Compose
- Git

### Локальный запуск

#### Вариант 1: Использование скриптов

**Linux/macOS:**
```bash
chmod +x scripts/start-local.sh
./scripts/start-local.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\start-local.ps1
```

#### Вариант 2: Использование Makefile

```bash
# Показать все доступные команды
make help

# Сборка и запуск
make dev

# Просмотр логов
make logs

# Остановка
make down
```

#### Вариант 3: Docker Compose напрямую

```bash
# Сборка и запуск
docker-compose up --build -d

# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## 🌐 Доступ к сервисам

После запуска сервисы будут доступны по следующим адресам:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api
- **Adminer (DB Admin)**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### Данные для подключения к БД

- **Host**: localhost (или postgres внутри Docker)
- **Port**: 5432
- **Database**: nestdb
- **Username**: yourusername
- **Password**: GvXWmzMLP03HNmrp

## 📁 Структура проекта

```
TimeTracker/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/         # React SPA
│       ├── src/
│       ├── nginx.conf
│       ├── Dockerfile
│       └── package.json
├── scripts/              # Скрипты для запуска
├── docker-compose.yml    # Конфигурация Docker
├── Makefile             # Команды для разработки
└── README.md
```

## 🛠️ Команды разработки

### Makefile команды

```bash
make help           # Показать справку
make build          # Собрать контейнеры
make up             # Запустить сервисы
make down           # Остановить сервисы
make restart        # Перезапустить сервисы
make logs           # Показать логи всех сервисов
make logs-backend   # Логи бэкенда
make logs-frontend  # Логи фронтенда
make logs-db        # Логи базы данных
make status         # Статус контейнеров
make clean          # Полная очистка
make dev            # Сборка и запуск для разработки
make shell-backend  # Подключиться к контейнеру бэкенда
make shell-frontend # Подключиться к контейнеру фронтенда
make shell-db       # Подключиться к базе данных
```

### Docker Compose команды

```bash
# Сборка без кэша
docker-compose build --no-cache

# Запуск с пересборкой
docker-compose up --build

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Выполнение команд в контейнере
docker-compose exec backend npm run migration:run
docker-compose exec frontend sh
```

## 🔧 Настройка для продакшена

Для продакшена рекомендуется:

1. Изменить пароли в переменных окружения
2. Настроить SSL сертификаты
3. Использовать внешнюю базу данных
4. Настроить мониторинг и логирование
5. Настроить резервное копирование

## 🐛 Отладка

### Проверка статуса контейнеров
```bash
docker-compose ps
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
```

### Подключение к контейнеру
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# База данных
docker-compose exec postgres psql -U yourusername -d nestdb
```

### Очистка при проблемах
```bash
# Полная очистка
make clean

# Или через Docker Compose
docker-compose down --rmi all --volumes --remove-orphans
docker system prune -f
```

## 📝 Разработка

### Добавление новых зависимостей

**Backend:**
```bash
docker-compose exec backend npm install package-name
```

**Frontend:**
```bash
docker-compose exec frontend npm install package-name
```

### Миграции базы данных

```bash
# Создание миграции
docker-compose exec backend npm run migration:generate

# Применение миграций
docker-compose exec backend npm run migration:run

# Откат миграции
docker-compose exec backend npm run migration:revert
```
