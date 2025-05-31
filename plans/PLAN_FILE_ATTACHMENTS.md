# План добавления файлов к заметкам

## Бэкенд

### Сущности
- [ ] Создать `apps/backend/src/entities/file.entity.ts`:
```typescript
@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  storageKey: string;

  @Column()
  mimeType: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => Note, (note) => note.files, { onDelete: 'CASCADE' })
  note: Note;
}
```

- [ ] Обновить `apps/backend/src/entities/note.entity.ts`:
```typescript
@OneToMany(() => File, (file) => file.note)
files: File[];
```

### DTO
- [ ] Создать `apps/backend/src/api/notes/dto/file.dto.ts`:
```typescript
export class FileDto {
  id: string;
  name: string;
  size: number;
  storageKey: string;
  mimeType: string;
  uploadedAt: string;
}

export class UploadFileDto {
  @IsNotEmpty()
  file: Express.Multer.File;
}
```

### API
- [ ] Создать `apps/backend/src/api/notes/file.service.ts`:
```typescript
@Injectable()
export class FileService {
  uploadFile(noteId: string, file: Express.Multer.File): Promise<FileDto>
  getFiles(noteId: string): Promise<FileDto[]>
  deleteFile(fileId: string): Promise<void>
  validateFile(file: Express.Multer.File): boolean
}
```

- [ ] Создать `apps/backend/src/api/notes/file.controller.ts`:
```typescript
@Controller('notes/:noteId/files')
export class FileController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Param('noteId') noteId: string, @UploadedFile() file: Express.Multer.File)

  @Get()
  getFiles(@Param('noteId') noteId: string)

  @Delete(':fileId')
  deleteFile(@Param('fileId') fileId: string)
}
```

- [ ] Настроить multer middleware для загрузки файлов
- [ ] Добавить валидацию: макс 25MB, типы: pdf, doc, docx, png, jpg, jpeg
- [ ] Обновить `notes.module.ts` (добавить FileService, FileController)

### Хранилище
- [ ] Добавить в `.env`:
```
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=26214400
```
- [ ] Создать папку `/uploads` в корне бэкенда
- [ ] Логика сохранения: `/uploads/{noteId}/{uuid}.ext`

## Фронтенд

### Компоненты UI
- [ ] Создать `apps/frontend/src/components/ui/file-uploader.tsx`:
```typescript
interface FileUploaderProps {
  noteId: string;
  onUpload: (file: FileDto) => void;
  maxSize?: number;
  accept?: string;
}
```

- [ ] Создать `apps/frontend/src/components/ui/file-list.tsx`:
```typescript
interface FileListProps {
  files: FileDto[];
  onDelete: (fileId: string) => void;
}
```

- [ ] Создать `apps/frontend/src/components/ui/file-item.tsx`:
```typescript
interface FileItemProps {
  file: FileDto;
  onDelete: (fileId: string) => void;
}
```

### API Service
- [ ] Обновить `apps/frontend/src/shared/api/notes.service.ts`:
```typescript
export const notesApi = {
  // существующие методы...
  
  uploadFile: (noteId: string, file: File): Promise<FileDto> => 
    axios.post(`/api/v1/notes/${noteId}/files`, formData),
    
  getFiles: (noteId: string): Promise<FileDto[]> => 
    axios.get(`/api/v1/notes/${noteId}/files`),
    
  deleteFile: (noteId: string, fileId: string): Promise<void> => 
    axios.delete(`/api/v1/notes/${noteId}/files/${fileId}`)
}
```

### Интеграция
- [ ] Найти компонент заметки (NoteCard или similar)
- [ ] Добавить FileUploader и FileList в компонент заметки
- [ ] Реализовать drag-and-drop функциональность
- [ ] Добавить progress bar для загрузки
- [ ] Обработка ошибок через notistack

## Миграция
- [ ] Создать миграцию для таблицы `files`
- [ ] Добавить индекс на `note_id`

## Тестирование
- [ ] Backend: юнит-тесты FileService
- [ ] Frontend: тесты компонентов
- [ ] E2E: загрузка, отображение, удаление файлов

## Финальные шаги
- [ ] Обновить Swagger документацию
- [ ] Проверить работу в dev окружении
- [ ] Commit и push изменений 