# Правила разработки TimeTracker

## 📋 Общие принципы

### 1. Архитектура проекта
- **Монорепозиторий** с разделением на `apps/frontend` и `apps/backend`
- **Feature-Sliced Design** для фронтенда
- **Модульная архитектура NestJS** для бэкенда
- **TypeScript** обязателен для всех компонентов

### 2. Стек технологий

#### Frontend
- React 19 + TypeScript
- Vite как сборщик
- shadcn/ui + Radix UI для компонентов
- Tailwind CSS для стилизации
- Redux Toolkit для управления состоянием
- React Router v7 для маршрутизации
- React Hook Form + Zod для форм и валидации
- Vitest + Testing Library для тестирования

#### Backend
- NestJS 10 + TypeScript
- TypeORM для работы с БД
- PostgreSQL как основная БД
- JWT для аутентификации
- Swagger для документации API
- Jest для тестирования

## 🎯 Правила написания кода

### 1. Именование

#### Файлы и папки
```bash
# Компоненты React - PascalCase
UserProfile.tsx
TaskCard.tsx

# Хуки - camelCase с префиксом use
useAuth.ts
useTaskList.ts

# Утилиты - camelCase
formatDate.ts
apiClient.ts

# Константы - UPPER_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts

# Папки - kebab-case
task-cards/
user-profile/
```

#### Переменные и функции
```typescript
// camelCase для переменных и функций
const userName = 'John';
const getUserTasks = () => {};

// PascalCase для классы, интерфейсы, типы
interface UserData {}
type TaskStatus = 'pending' | 'completed';
class UserService {}

// UPPER_SNAKE_CASE для констант
const API_BASE_URL = 'http://localhost:3000';
const MAX_RETRY_ATTEMPTS = 3;
```

### 2. Структура файлов

#### Frontend (Feature-Sliced Design)
```
src/
├── app/           # Инициализация приложения
├── pages/         # Страницы приложения
├── widgets/       # Самостоятельные блоки интерфейса
├── features/      # Части функциональности
├── entities/      # Бизнес-сущности
├── shared/        # Переиспользуемые ресурсы
└── layouts/       # Макеты страниц
```

#### Backend (NestJS модули)
```
src/
├── api/           # API модули (по доменам)
├── auth/          # Аутентификация
├── common/        # Общие компоненты
├── entities/      # Сущности БД
├── guards/        # Охранники
├── decorators/    # Декораторы
└── filters/       # Фильтры
```

### 3. Импорты

#### Порядок импортов
```typescript
// 1. Библиотеки Node.js (если есть)
import path from 'path';

// 2. Внешние библиотеки
import React from 'react';
import { Injectable } from '@nestjs/common';

// 3. Внутренние модули (абсолютные пути)
import { UserService } from '@/api/users/user.service';
import { Button } from '@/shared/ui/Button';

// 4. Относительные импорты
import './styles.css';
import { validateForm } from '../utils/validation';
```

## 🔧 Git и управление версиями

### 1. Соглашения о коммитах

Используем [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Типы коммитов
feat:     # Новая функциональность
fix:      # Исправление бага
docs:     # Изменения в документации
style:    # Форматирование, отсутствуют изменения кода
refactor: # Рефакторинг
test:     # Добавление тестов
chore:    # Обновление зависимостей, конфигурации

# Примеры
feat: add user authentication
fix: resolve login form validation
docs: update API documentation
refactor: optimize task fetching logic
```

### 2. Структура веток

```bash
main          # Основная ветка (продакшн)
develop       # Ветка разработки
feature/*     # Ветки функций
fix/*         # Ветки исправлений
hotfix/*      # Критические исправления
```

### 3. Pull Request

Каждый PR должен содержать:
- Описательное название
- Описание изменений
- Ссылки на задачи (если есть)
- Скриншоты UI изменений (для фронтенда)

## 🧪 Тестирование

### 1. Frontend

```typescript
// Компонентные тесты
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

test('should render user name', () => {
  render(<UserCard name="John Doe" />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});

// Хуки тесты
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

test('should return user data when authenticated', () => {
  const { result } = renderHook(() => useAuth());
  expect(result.current.isAuthenticated).toBe(true);
});
```

### 2. Backend

```typescript
// Unit тесты
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create user', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const result = await service.create(userData);
    expect(result.name).toBe('John');
  });
});

// E2E тесты
describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
```

## 📝 Документация кода

### 1. JSDoc комментарии

```typescript
/**
 * Получает список задач пользователя
 * @param userId - ID пользователя
 * @param filters - Фильтры для задач
 * @returns Promise со списком задач
 */
async function getUserTasks(
  userId: string,
  filters?: TaskFilters
): Promise<Task[]> {
  // ...
}
```

### 2. TypeScript типы

```typescript
// Обязательно типизируйте все
interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId: string;
}

// Используйте дискриминированные union для состояний
type TaskState = 
  | { status: 'loading' }
  | { status: 'success'; data: Task[] }
  | { status: 'error'; error: string };
```

## 🎨 UI/UX правила

### 1. Компоненты

- Используйте **shadcn/ui** для базовых компонентов
- Создавайте **составные компоненты** для сложной логики
- Следуйте принципам **доступности** (a11y)

```typescript
// Правильно
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
};
```

### 2. Стилизация

- Используйте **Tailwind CSS** классы
- Создавайте **утилиты** для часто используемых стилей
- Используйте **CSS переменные** для темизации

```typescript
// Утилита для стилей
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
  }
);
```

## 🔒 Безопасность

### 1. Frontend

- **Никогда не храните** секретные данные в localStorage
- Используйте **httpOnly cookies** для токенов
- **Валидируйте** все пользовательские данные
- Используйте **HTTPS** в продакшене

### 2. Backend

- Используйте **DTO** для валидации входных данных
- Применяйте **охранники** для авторизации
- **Санитизируйте** SQL запросы (используйте TypeORM)
- Логируйте **безопасные** данные

```typescript
// DTO с валидацией
export class CreateTaskDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}

// Охранник
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  // ...
}
```

## 🚀 Развертывание

### 1. Локальная разработка

```bash
# Запуск всех сервисов
make dev

# Только база данных для локальной разработки
make dev-local
npm run start  # В корне проекта

# Полная очистка при проблемах
make clean
```

### 2. Продакшн

```bash
# Развертывание в продакшн
make prod-build

# Мониторинг
make prod-logs
make prod-status
```

## 📊 Производительность

### 1. Frontend

- Используйте **React.memo** для тяжелых компонентов
- Применяйте **useMemo** и **useCallback** по необходимости
- Реализуйте **виртуализацию** для больших списков
- Оптимизируйте **изображения** и статические ресурсы

### 2. Backend

- Используйте **пагинацию** для больших выборок
- Применяйте **индексы** для часто запрашиваемых полей
- Кэшируйте **статические данные**
- Оптимизируйте **SQL запросы**

## ❗ Частые ошибки

### 1. Что НЕ делать

```typescript
// ❌ Плохо
const UserProfile = (props: any) => {
  const [user, setUser] = useState();
  
  useEffect(() => {
    fetch('/api/user').then(res => setUser(res));
  }, []);

  return <div>{user.name}</div>;
};

// ✅ Хорошо
interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await userApi.getById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <NotFound />;

  return <div>{user.name}</div>;
};
```

### 2. Производительность

```typescript
// ❌ Плохо - создает новый объект при каждом рендере
const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onUpdate={() => updateTask(task.id, { status: 'completed' })}
        />
      ))}
    </div>
  );
};

// ✅ Хорошо - мемоизированный callback
const TaskList = ({ tasks, onTaskUpdate }: TaskListProps) => {
  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
    onTaskUpdate(taskId, updates);
  }, [onTaskUpdate]);

  return (
    <div>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onUpdate={handleTaskUpdate}
        />
      ))}
    </div>
  );
};
```

## 🔍 Code Review

При проведении code review проверяйте:

1. **Соответствие стандартам** кодирования
2. **Типизацию** TypeScript
3. **Тестовое покрытие**
4. **Безопасность** кода
5. **Производительность**
6. **Доступность** (a11y)
7. **Документирование** изменений

---

**Помните**: Эти правила призваны помочь команде писать качественный, поддерживаемый код. При возникновении спорных ситуаций обсуждайте их с командой и обновляйте правила по необходимости. 