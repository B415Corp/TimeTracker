# 🚀 Локальная разработка TimeTracker

Данная инструкция поможет запустить фронтенд и бэкенд локально с подключением к PostgreSQL в Docker.

## 📋 Предварительные требования

- Node.js 18+ 
- Docker и Docker Compose
- npm или yarn

## 🛠️ Быстрый старт

### 1. Запуск только базы данных в Docker

```bash
npm run db:start
```

### 2. Запуск всего проекта локально

```bash
npm run start
```

Это запустит:
- **Frontend** на `http://localhost:5173` (Vite dev server)
- **Backend** на `http://localhost:3000` (NestJS dev mode)
- **PostgreSQL** в Docker контейнере на порту `5432`

### 3. Автоматический запуск БД + приложения

```bash
npm run dev:setup
```

## 🔧 Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run start` | Запуск frontend + backend локально |
| `npm run start:frontend` | Только frontend |
| `npm run start:backend` | Только backend |
| `npm run db:start` | Запуск PostgreSQL в Docker |
| `npm run db:stop` | Остановка PostgreSQL |
| `npm run db:logs` | Логи PostgreSQL |
| `npm run dev:setup` | БД + приложение автоматически |

## 🌐 Адреса сервисов

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **Swagger docs**: http://localhost:3000/docs
- **Health check**: http://localhost:3000/health
- **Adminer** (если запущен): http://localhost:8080

## 🗄️ База данных

### Подключение к PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: nestdb
- **Username**: yourusername
- **Password**: GvXWmzMLP03HNmrp

### Через Adminer
```bash
docker-compose up -d adminer
```
Затем откройте http://localhost:8080

## 📁 Конфигурационные файлы

- `.env.local` - настройки backend для локальной разработки
- `apps/frontend/.env.local` - настройки frontend 

## 🔍 Проблемы и решения

### Backend не может подключиться к БД
1. Убедитесь что PostgreSQL запущен: `npm run db:start`
2. Проверьте логи БД: `npm run db:logs`
3. Проверьте настройки в `.env.local`

### Frontend не может подключиться к API
1. Проверьте что backend работает на порту 3000
2. Проверьте настройки CORS в backend
3. Убедитесь что в `apps/frontend/.env.local` правильный VITE_API_URL

### Проблемы с портами
- Frontend: 5173 (Vite default)
- Backend: 3000 
- PostgreSQL: 5432
- Adminer: 8080

Убедитесь что эти порты свободны. 