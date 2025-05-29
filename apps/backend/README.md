# TimeTracker Backend

## Структура API

Все API эндпоинты следуют структуре: `/api/v{версия}/{контроллер}/{метод}`

### Документация
- **Swagger UI**: `http://localhost:3000/docs`
- **JSON Schema**: `http://localhost:3000/docs-json`
- **Health Check**: `http://localhost:3000/health`

### Примеры маршрутов
- `GET /api/v1/testGet` - Тестовый эндпоинт
- `GET /api/v1/users/me` - Данные пользователя
- `GET /api/v1/projects` - Список проектов

Подробную информацию см. в [ROUTES_GUIDE.md](./ROUTES_GUIDE.md)

## Запуск

### Docker
Чтобы запустить все сервисы, включая Adminer:

docker-compose up
Если вы хотите запустить только определенные сервисы, вы можете указать их имена:

docker-compose up app-dev db-dev adminer
или

docker-compose up app-prod db-prod adminer

### Локальная разработка
```bash
cd apps/backend
npm install
npm run start:dev
```