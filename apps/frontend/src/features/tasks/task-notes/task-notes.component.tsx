import { useState } from "react";
import { useGetTaskNotesQuery } from "@/shared/api/task.service";
import { useCreateNotesMutation, useEditNotesMutation, useDeleteNotesMutation } from "@/shared/api/notes.service";
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
import { NoteLine } from "./note-line.types";

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
      text_content: editingNote?.text_content || "",
      parent_note_id: parentNote?.notes_id || editingNote?.parent_note_id || undefined,
    },
  });

  const onSubmit = async (values: NoteFormValues) => {
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

export default function TaskNotes({ taskId }: TaskNotesProps) {
  const { data: notes, isLoading, error } = useGetTaskNotesQuery(taskId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Notes | null>(null);
  const [parentNote, setParentNote] = useState<Notes | null>(null);

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

  // Тестовые данные для нового редактора
  const testLines: NoteLine[] = [
    { id: "1", parentId: null, order: 0, type: "heading", content: "Заголовок" },
    { id: "2", parentId: null, order: 1, type: "text", content: "Текст 1" },
    { id: "3", parentId: null, order: 2, type: "list", content: "Пункт списка" },
  ];

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
      {/* Новый редактор заметок для теста */}
      <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Новый редактор заметок (тест)</h3>
        <NoteLinesEditor lines={testLines} />
      </div>
      {mainNote ? (
        <div>
          <NoteCard
            note={mainNote}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onAddChild={handleAddChildNote}
            isMain
          />
          <div className="mt-6 space-y-3">
            {childNotes.length > 0 ? (
              childNotes.map((note) => (
                <NoteCard
                  key={note.notes_id}
                  note={{
                    ...note,
                    created_at: '', // Укажите значение по умолчанию или получите его из источника данных
                    updated_at: '', // Укажите значение по умолчанию или получите его из источника данных
                    text_content: '', // Укажите значение по умолчанию или получите его из источника данных
                  }}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onAddChild={() => {}}
                />
              ))
            ) : (
              <div className="text-muted-foreground text-sm mt-2 ml-4">Вложенных заметок нет</div>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Заметка не найдена</p>
          </CardContent>
        </Card>
      )}
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