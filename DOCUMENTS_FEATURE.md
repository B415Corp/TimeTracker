# Documents Feature - Notion-like система документов

## ✅ Реализовано

### Backend (NestJS + TypeORM + PostgreSQL)

#### 1. Database Entities
- ✅ **Document** - основная entity документа
- ✅ **DocumentBlock** - блоки документа (отдельная таблица для future real-time)
- ✅ **CustomField** - настраиваемые поля проектов
- ✅ **DocumentFieldValue** - значения полей для документов
- ✅ **DocumentMember** - участники документа с ролями
- ✅ **DocumentVersion** - простая история версий
- ✅ **DocumentComment** - комментарии к документам и блокам
- ✅ **DocumentFile** - файлы документов

#### 2. Enums
- ✅ **BlockType** - типы блоков (paragraph, heading_1-3, list, table, image, file, etc)
- ✅ **FieldType** - типы кастомных полей (text, number, select, date, etc)
- ✅ **DocumentRole** - роли доступа (owner, editor, viewer, commenter)

#### 3. API Modules & Endpoints

**DocumentsModule** (`/api/v1/documents`)
- ✅ POST `/projects/:projectId/documents` - создать документ
- ✅ GET `/projects/:projectId/documents` - список документов проекта
- ✅ GET `/documents/:documentId` - получить документ
- ✅ PATCH `/documents/:documentId` - обновить документ
- ✅ DELETE `/documents/:documentId` - удалить документ
- ✅ POST `/documents/:documentId/move` - переместить в иерархии
- ✅ GET `/documents/:documentId/tree` - получить дерево дочерних документов

**DocumentBlocksModule** (`/api/v1/blocks`)
- ✅ POST `/documents/:documentId/blocks` - создать блок
- ✅ GET `/documents/:documentId/blocks` - получить все блоки
- ✅ PATCH `/blocks/:blockId` - обновить блок
- ✅ DELETE `/blocks/:blockId` - удалить блок
- ✅ POST `/documents/:documentId/blocks/reorder` - изменить порядок блоков
- ✅ POST `/blocks/:blockId/convert` - конвертация типа блока

**CustomFieldsModule** (`/api/v1/fields`)
- ✅ POST `/projects/:projectId/fields` - создать поле
- ✅ GET `/projects/:projectId/fields` - список полей
- ✅ PATCH `/fields/:fieldId` - обновить поле
- ✅ DELETE `/fields/:fieldId` - удалить поле
- ✅ POST `/documents/:documentId/fields/:fieldId/value` - установить значение
- ✅ GET `/documents/:documentId/fields` - получить все значения полей

**DocumentMembersModule** (`/api/v1/documents/:documentId/members`)
- ✅ POST - добавить участника
- ✅ GET - список участников
- ✅ PATCH `/:memberId` - изменить роль
- ✅ DELETE `/:memberId` - удалить участника
- ✅ GET `/access` - проверить доступ текущего пользователя

**DocumentCommentsModule** (`/api/v1/comments`)
- ✅ POST `/documents/:documentId/comments` - создать комментарий к документу
- ✅ POST `/blocks/:blockId/comments` - создать комментарий к блоку
- ✅ GET `/documents/:documentId/comments` - получить все комментарии
- ✅ PATCH `/comments/:commentId` - редактировать комментарий
- ✅ DELETE `/comments/:commentId` - удалить комментарий
- ✅ POST `/comments/:commentId/replies` - ответить на комментарий

**DocumentFilesModule** (`/api/v1/files`)
- ✅ POST `/documents/:documentId/files` - загрузить файл
- ✅ GET `/documents/:documentId/files` - список файлов
- ✅ GET `/files/:fileId` - скачать файл
- ✅ DELETE `/files/:fileId` - удалить файл

**DocumentVersionsModule** (`/api/v1/documents/:documentId/versions`)
- ✅ GET - получить историю версий

#### 4. Guards & Authorization
- ✅ **DocumentAccessGuard** - проверка прав доступа с гибридной моделью:
  - Project OWNER → полный доступ
  - Project MANAGER/EXECUTOR → доступ по умолчанию (наследование)
  - Явные DocumentMembers → приоритет над наследованием
  - Роли: OWNER (full), EDITOR (full), COMMENTER (read+comment), VIEWER (read-only)

#### 5. Интеграция с Tasks
- ✅ Task.document_id - поле связи
- ✅ Relation Task ↔ Document

### Frontend (React 19 + RTK Query + shadcn/ui)

#### 1. API Services (RTK Query)
- ✅ `documentsApi.ts` - CRUD операции для документов
- ✅ `documentBlocksApi.ts` - управление блоками
- ✅ `customFieldsApi.ts` - кастомные поля
- ✅ `documentMembersApi.ts` - участники документов
- ✅ `documentCommentsApi.ts` - комментарии

#### 2. TypeScript Types
- ✅ Все типы определены в `shared/types/document.types.ts`
- ✅ Enums совпадают с backend

#### 3. UI Components (Entities Layer)

**document-block/ui/**
- ✅ `ParagraphBlock.tsx` - текстовый параграф
- ✅ `HeadingBlock.tsx` - заголовки (H1, H2, H3)
- ✅ `DividerBlock.tsx` - разделитель
- ✅ `BlockRenderer.tsx` - рендеринг блоков по типу

#### 4. Features

**document-editor/**
- ✅ `DocumentEditor.tsx` - главный редактор
  - Отображение блоков
  - Создание/обновление/удаление блоков
  - Debounced auto-save (300ms)
  - Keyboard shortcuts (Enter, Backspace)

**tasks/TaskDocumentSection.tsx**
- ✅ Интеграция с задачами
- ✅ Создание документа для задачи
- ✅ Переход к существующему документу

#### 5. Pages
- ✅ `DocumentPage.tsx` - страница просмотра/редактирования документа
- ✅ `DocumentsListPage.tsx` - список документов проекта

### Архитектурные решения

1. **Блоки в отдельной таблице** - готовность к real-time коллаборации
2. **Гибридная модель прав** - наследование от проекта + явное назначение
3. **Иерархия документов** - parent_document_id для древовидной структуры
4. **Debounced auto-save** - экономия запросов к API
5. **FSD архитектура** - чистое разделение на entities/features/pages

## 📋 TODO (дополнительные features)

### Phase 3: Дополнительные типы блоков
- ⏳ Bullet/Numbered/Checklist lists
- ⏳ Tables
- ⏳ Image blocks
- ⏳ File blocks
- ⏳ Link blocks (bookmark/embed)
- ⏳ Code blocks с syntax highlighting
- ⏳ Callout blocks
- ⏳ Quote blocks

### Phase 4: Продвинутые фичи редактора
- ⏳ Slash commands (`/heading`, `/table`, etc)
- ⏳ Markdown shortcuts (`#` → heading, `*` → list, etc)
- ⏳ Drag & drop блоков (@dnd-kit)
- ⏳ Floating toolbar для форматирования текста
- ⏳ Mentions (@пользователь)
- ⏳ Emoji picker для иконок

### Phase 5-6: Кастомные поля и UI
- ⏳ UI для всех типов кастомных полей
- ⏳ DocumentTree component с drag & drop
- ⏳ Breadcrumbs навигация

### Phase 7-8: Права и комментарии
- ⏳ PermissionsDialog - управление доступом
- ⏳ MemberList component
- ⏳ CommentsPanel - боковая панель комментариев
- ⏳ Thread view для ответов

### Future: Real-time коллаборация
- ⏳ WebSocket/Socket.io интеграция
- ⏳ Курсоры пользователей
- ⏳ Live updates блоков
- ⏳ Typing indicators

## 🚀 Как использовать

### 1. Создание документа

**Из проекта:**
```
/projects/:projectId/documents → "New Document"
```

**Из задачи:**
```
Task Detail → вкладка "Документ" → "Create Document"
```

### 2. Редактирование документа

- Кликните на блок чтобы редактировать
- **Enter** - создать новый блок после текущего
- **Backspace** на пустом блоке - удалить блок
- Изменения сохраняются автоматически через 300ms

### 3. Организация документов

- Используйте `parent_document_id` для создания иерархии
- Перемещайте документы через API `/documents/:id/move`

### 4. Права доступа

**Автоматическое наследование:**
- Участники проекта получают доступ к документам проекта

**Явное назначение:**
- Добавьте конкретных пользователей через DocumentMembers API
- Роли: OWNER, EDITOR, VIEWER, COMMENTER

## 📦 Dependencies

### Backend
- TypeORM (entities, relations)
- class-validator (DTOs)
- @nestjs/platform-express (file upload)
- multer (file processing)

### Frontend
- @dnd-kit/* (installed, готово к drag & drop)
- react-window (installed, готово к virtual scrolling)
- emoji-picker-react (installed, готово к emoji picker)
- prismjs (installed, готово к syntax highlighting)
- react-markdown (installed, готово к markdown preview)

## 🔧 Настройка

### Backend

Все модули уже зарегистрированы в `app.module.ts`:
```typescript
DocumentsModule,
DocumentBlocksModule,
CustomFieldsModule,
DocumentMembersModule,
DocumentCommentsModule,
DocumentFilesModule,
DocumentVersionsModule,
```

TypeORM `synchronize: true` автоматически создаст таблицы.

### Frontend

API baseUrl настраивается через `VITE_API_URL` в `.env`.

Теги для RTK Query invalidation:
- Documents
- DocumentBlocks
- CustomFields
- DocumentMembers
- DocumentComments
- DocumentFiles
- DocumentVersions

## 📊 Структура базы данных

```
documents
├── document_id (PK)
├── project_id (FK → projects)
├── parent_document_id (FK → documents, nullable)
├── title
├── icon
├── cover_image
├── created_by (FK → users)
├── updated_by (FK → users)
└── timestamps

document_blocks
├── block_id (PK)
├── document_id (FK → documents)
├── type (enum)
├── content (JSONB)
├── order (int)
├── parent_block_id (FK → document_blocks, nullable)
├── properties (JSONB)
└── timestamps

custom_fields
├── field_id (PK)
├── project_id (FK → projects)
├── name
├── type (enum)
├── config (JSONB)
├── is_required
└── created_at

document_field_values
├── value_id (PK)
├── document_id (FK → documents)
├── field_id (FK → custom_fields)
└── value (JSONB)

document_members
├── member_id (PK)
├── document_id (FK → documents)
├── user_id (FK → users)
├── role (enum)
├── assigned_by (FK → users)
└── assigned_at

document_versions
├── version_id (PK)
├── document_id (FK → documents)
├── updated_by (FK → users)
├── updated_at
└── change_description

document_comments
├── comment_id (PK)
├── document_id (FK → documents, nullable)
├── block_id (FK → document_blocks, nullable)
├── user_id (FK → users)
├── content
├── parent_comment_id (FK → document_comments, nullable)
└── timestamps

document_files
├── file_id (PK)
├── document_id (FK → documents)
├── block_id (FK → document_blocks, nullable)
├── filename
├── path
├── mime_type
├── size
├── uploaded_by (FK → users)
└── created_at
```

## 🎯 Next Steps

1. Реализовать остальные типы блоков (списки, таблицы, изображения)
2. Добавить slash commands для быстрого добавления блоков
3. Реализовать markdown shortcuts
4. Добавить drag & drop для перемещения блоков
5. Создать UI для кастомных полей
6. Реализовать дерево документов в sidebar
7. Добавить панель комментариев
8. Подготовить к real-time коллаборации (WebSocket)
