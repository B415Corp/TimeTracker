---
name: Notion-like Documents System
overview: Реализация полнофункциональной системы документов с кастомным блочным редактором, настраиваемыми полями, иерархией, правами доступа и комментариями
todos: []
isProject: false
---

# План реализации системы документов (Notion-like)

## Общая архитектура

Система документов будет интегрирована в существующую архитектуру TimeTracker:
- Backend: NestJS модули для документов с использованием TypeORM
- Frontend: FSD-архитектура с features/widgets для редактора документов
- Связь с задачами: Task может иметь связанный документ
- Права доступа: гибридная модель (наследование от проекта + явное назначение)

## Backend структура

### 1. Database Entities (TypeORM)

Создать новые entities в [`apps/backend/src/entities/`](apps/backend/src/entities/):

#### Document Entity
```typescript
@Entity('documents')
export class Document {
  document_id: string (UUID, PK)
  project_id: string (FK → Project)
  parent_document_id?: string (FK → Document, для иерархии)
  title: string
  icon?: string (emoji или URL)
  cover_image?: string
  created_by: string (FK → User)
  updated_by?: string (FK → User)
  created_at: Date
  updated_at: Date
  
  // Relations
  project: Project
  parent: Document
  children: Document[]
  blocks: DocumentBlock[]
  members: DocumentMember[]
  customFieldValues: DocumentFieldValue[]
  comments: DocumentComment[]
  versions: DocumentVersion[]
  tasks: Task[] (документ может быть связан с несколькими задачами)
}
```

#### DocumentBlock Entity
Отдельная таблица для блоков (лучше для real-time в будущем):
```typescript
@Entity('document_blocks')
export class DocumentBlock {
  block_id: string (UUID, PK)
  document_id: string (FK → Document)
  type: BlockType (enum: paragraph, heading, list, table, image, file, link, code, divider, callout)
  content: JSON (структура зависит от типа блока)
  order: number (позиция блока в документе)
  parent_block_id?: string (FK → DocumentBlock, для вложенности)
  properties: JSON (метаданные: уровень heading, стиль списка и т.д.)
  created_at: Date
  updated_at: Date
  
  // Relations
  document: Document
  parent: DocumentBlock
  children: DocumentBlock[]
  comments: DocumentComment[]
}
```

**Структура content для разных типов блоков:**
- `paragraph/heading/quote`: `{ text: string, marks: Mark[] }` - текст с форматированием
- `list`: `{ items: ListItem[], style: 'bullet' | 'numbered' | 'checklist' }`
- `table`: `{ rows: Row[], columns: Column[] }`
- `image`: `{ url: string, caption?: string, width?: number, height?: number }`
- `file`: `{ file_id: string, filename: string, size: number, mime_type: string }`
- `link`: `{ url: string, title?: string, description?: string, type: 'bookmark' | 'embed' }`
- `code`: `{ code: string, language: string }`
- `callout`: `{ text: string, icon?: string, color: string }`

#### CustomField Entity
```typescript
@Entity('custom_fields')
export class CustomField {
  field_id: string (UUID, PK)
  project_id: string (FK → Project)
  name: string
  type: FieldType (enum: text, number, select, multi_select, date, checkbox, url, user, relation, tags)
  config: JSON (опции для select, формат для даты и т.д.)
  is_required: boolean
  created_at: Date
  
  // Relations
  project: Project
  values: DocumentFieldValue[]
}
```

#### DocumentFieldValue Entity
```typescript
@Entity('document_field_values')
export class DocumentFieldValue {
  value_id: string (UUID, PK)
  document_id: string (FK → Document)
  field_id: string (FK → CustomField)
  value: JSON (значение зависит от типа поля)
  
  // Relations
  document: Document
  field: CustomField
}
```

#### DocumentMember Entity
```typescript
@Entity