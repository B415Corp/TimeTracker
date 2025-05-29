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

interface NoteCardProps {
  note: Notes;
  onEdit: (note: Notes) => void;
  onDelete: (noteId: string) => void;
  onAddChild: (note: Notes) => void;
  isMain?: boolean;
}

function NoteCard({ note, onEdit, onDelete, onAddChild, isMain }: NoteCardProps) {
  const [deleteNote] = useDeleteNotesMutation();
  
  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту заметку? Все дочерние заметки тоже будут удалены.")) {
      try {
        await deleteNote({ id: note.notes_id }).unwrap();
        onDelete(note.notes_id);
      } catch (error) {
        console.error("Ошибка при удалении заметки:", error);
      }
    }
  };

  return (
    <Card className={isMain ? "border-2 border-primary" : note.nesting_level > 0 ? `ml-${Math.min(note.nesting_level * 4, 16)}` : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {isMain && (
                <Badge variant="primary" className="text-xs ml-2">Главная</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(note.created_at)}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              {isMain && (
                <DropdownMenuItem onClick={() => onAddChild(note)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить вложенную
                </DropdownMenuItem>
              )}
              {!isMain && (
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {note.text_content}
          </p>
        </div>
        {note.childNotes && note.childNotes.length > 0 && (
          <div className="mt-3 text-xs text-muted-foreground">
            Вложенных заметок: {note.childNotes.length}
          </div>
        )}
      </CardContent>
    </Card>
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
  const mainNote = notes?.find((n) => !n.parent_note_id) || null;
  // Вложенные заметки (childNotes главной)
  const childNotes = mainNote?.childNotes || [];

  return (
    <div className="space-y-6">
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
                  note={note}
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