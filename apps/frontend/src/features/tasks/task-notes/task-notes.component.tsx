import { useState, useEffect } from "react";
import { useGetTaskNotesQuery } from "@/shared/api/task.service";
import { useGetNotesByTaskQuery, useEditNotesMutation, useCreateNotesMutation, useDeleteNotesMutation } from "@/shared/api/notes.service";
import { useCreateNotesMutation as useCreateNotesMutationFromNotesService } from "@/shared/api/notes.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Notes } from "@/shared/interfaces/notes.interface";
import { 
  FileText, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Calendar,
  Hash
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import NoteCard from "./task-note-card.component";
import { NoteLinesEditor } from "./note-lines-editor";
import { NoteLine, NoteLineType } from "./note-line.types";
import { deserializeNoteLines, serializeNoteLines, treeToFlat } from "./note-lines-serialize";
import { useSnackbar } from 'notistack';

// Функция для генерации уникальных ID
const generateId = () => Math.random().toString(36).substring(2, 11);

const noteFormSchema = z.object({
  text_content: z.string().min(1, "Содержание обязательно"),
  parent_note_id: z.string().optional(),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface TaskNotesProps {
  taskId: string;
}

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  editingNote?: Notes | null;
  parentNote?: Notes | null;
}

function NoteDialog({ isOpen, onClose, taskId, editingNote, parentNote }: NoteDialogProps) {
  const [createNote, { isLoading: isCreating }] = useCreateNotesMutation();
  const [editNote, { isLoading: isEditing }] = useEditNotesMutation();
  
  const isEditMode = !!editingNote;
  const isLoading = isCreating || isEditing;
  
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      text_content: Array.isArray(editingNote?.text_content)
        ? JSON.stringify(editingNote.text_content)
        : (editingNote?.text_content || ""),
      parent_note_id: parentNote?.notes_id || editingNote?.parent_note_id || undefined,
    },
  });

  const onSubmit: (values: NoteFormValues) => Promise<void> = async (values) => {
    try {
      if (isEditMode && editingNote) {
        await editNote({
          note_id: editingNote.notes_id,
          ...values,
        }).unwrap();
      } else {
        await createNote({
          ...values,
          task_id: taskId,
        }).unwrap();
      }
      form.reset();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Редактировать заметку" : parentNote ? "Новая вложенная заметка" : "Новая заметка"}
          </DialogTitle>
          {parentNote && (
            <CardDescription>
              Дочерняя заметка
            </CardDescription>
          )}
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <FormField
              control={form.control}
              name="text_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержание заметки</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32"
                      placeholder="Введите содержание заметки..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function showSuccess(msg: string) {
  alert(msg); // заменить на toast при наличии
}
function showError(msg: string) {
  alert(msg); // заменить на toast при наличии
}

export default function TaskNotes({ taskId }: TaskNotesProps) {
  const { data: notes, isLoading, error } = useGetTaskNotesQuery(taskId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Notes | null>(null);
  const [parentNote, setParentNote] = useState<Notes | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleEditNote = (note: Notes) => {
    setEditingNote(note);
    setParentNote(null);
    setDialogOpen(true);
  };

  const handleAddChildNote = (note: Notes) => {
    setEditingNote(null);
    setParentNote(note);
    setDialogOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    // Заметка уже удалена в NoteCard, здесь можно добавить дополнительную логику
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
    setParentNote(null);
  };

  // --- Новый редактор заметок с интеграцией API ---
  const { data: apiNotes, isLoading: isNotesLoading } = useGetNotesByTaskQuery({ task_id: taskId });
  const [editNote] = useEditNotesMutation();
  const [createNote] = useCreateNotesMutation();
  const [deleteNote] = useDeleteNotesMutation();
  const [lines, setLines] = useState<NoteLine[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [originalLines, setOriginalLines] = useState<NoteLine[]>([]);

  useEffect(() => {
    if (apiNotes) {
      console.log("🔍 Загрузка: исходные apiNotes:", apiNotes);
      
      let mapped: NoteLine[] = [];
      if (Array.isArray(apiNotes) && apiNotes.length > 0) {
        const noteContent = apiNotes[0].text_content;
        console.log("🔍 Загрузка: noteContent:", noteContent);
        
        if (typeof noteContent === 'string') {
          try {
            // Пробуем распарсить как JSON (новый формат)
            const parsed = JSON.parse(noteContent);
            console.log("🔍 Загрузка: parsed JSON:", parsed);
            
            if (Array.isArray(parsed)) {
              // Это дерево блоков - десериализуем в flat
              mapped = deserializeNoteLines(noteContent);
              console.log("🔍 Загрузка: десериализованные lines:", mapped);
            } else {
              // Это старый plain text
              mapped = [{
                id: generateId(),
                parentId: null,
                order: 0,
                type: 'text',
                content: noteContent,
              }];
            }
          } catch {
            // Если не JSON — это plain text
            mapped = [{
              id: generateId(),
              parentId: null,
              order: 0,
              type: 'text',
              content: noteContent,
            }];
          }
        } else if (Array.isArray(noteContent)) {
          // Это уже массив — проверяем, дерево это или flat
          if (noteContent.length > 0 && noteContent[0].children !== undefined) {
            // Это дерево с children — преобразуем в flat
            console.log("🔍 Загрузка: обнаружено дерево, преобразуем в flat");
            mapped = treeToFlat(noteContent);
            console.log("🔍 Загрузка: преобразованный flat:", mapped);
          } else {
            // Это уже flat-массив NoteLine
            mapped = noteContent;
          }
        }
      }
      setLines(mapped);
      setOriginalLines(mapped);
      console.log('setLines (useEffect)', mapped);
      setIsDirty(false);
    }
  }, [apiNotes]);

  // Обработчик изменений в редакторе
  const handleLinesChange = (newLines: NoteLine[]) => {
    console.log('handleLinesChange', newLines);
    setLines(newLines);
    setIsDirty(true);
  };

  // Оптимизированное сохранение
  const handleSave = async () => {
    try {
      console.log("🔍 Сохранение: исходные lines:", lines);
      
      // Сохраняем всю структуру как JSON
      const json = serializeNoteLines(lines);
      console.log("🔍 Сохранение: сериализованный JSON:", json);
      
      if (apiNotes && apiNotes[0]) {
        await editNote({
          note_id: apiNotes[0].notes_id,
          text_content: json,
          task_id: taskId,
        });
      } else {
        await createNote({
          text_content: json,
          task_id: taskId,
        });
      }
      enqueueSnackbar("Заметки успешно сохранены!", { variant: "success" });
      setIsDirty(false);
    } catch (e) {
      console.error("❌ Ошибка сохранения:", e);
      enqueueSnackbar("Ошибка при сохранении заметок", { variant: "error" });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Загрузка заметки...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Ошибка при загрузке заметки
          </div>
        </CardContent>
      </Card>
    );
  }

  // Определяем главную заметку (без parent_note_id)
  const mainNote = notes?.find((n) => n.parent_note_id === null) || null;
  // Вложенные заметки (childNotes главной)
  const childNotes = mainNote?.childNotes || [];

  return (
    <div className="space-y-6">
      {/* Новый редактор заметок с интеграцией API */}
      <div style={{ borderRadius: 8, padding: 16, marginBottom: 24 }}>
        {isNotesLoading ? (
          <div>Загрузка...</div>
        ) : (
          <>
            <NoteLinesEditor lines={lines} onChange={handleLinesChange} onSave={handleSave} />
          </>
        )}
      </div>
      <NoteDialog
        isOpen={dialogOpen}
        onClose={closeDialog}
        taskId={taskId}
        editingNote={editingNote}
        parentNote={parentNote}
      />
    </div>
  );
}

// Вспомогательная функция для уровня вложенности
function getNestingLevel(lines: NoteLine[], id: string): number {
  let level = 0;
  let curr = lines.find(l => l.id === id);
  for (; curr && curr.parentId;) {
    level++;
    const nextCurr = lines.find(l => l.id === curr!.parentId);
    if (!nextCurr) break;
    curr = nextCurr;
  }
  return level;
} 