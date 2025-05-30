import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Plus, MoreVertical, Edit, Trash2, Calendar } from "lucide-react";
import { Notes } from "@/shared/interfaces/notes.interface";
import { formatDate } from "@/lib/dateUtils";
import { useDeleteNotesMutation } from "@/shared/api/notes.service";

interface NoteCardProps {
  note: Notes;
  onEdit: (note: Notes) => void;
  onDelete: (noteId: string) => void;
  onAddChild: (note: Notes) => void;
  isMain?: boolean;
}

export default function NoteCard({ note, onEdit, onDelete, onAddChild, isMain }: NoteCardProps) {
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
                <Badge variant="default" className="text-xs ml-2">Главная</Badge>
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
          {typeof note.text_content === 'string' ? (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note.text_content}</p>
          ) : Array.isArray(note.text_content) ? (
            <div className="space-y-1">
              {note.text_content.map((block: any) => (
                <div key={block.id} className="text-sm text-muted-foreground">
                  <span className="font-semibold">[{block.type}]</span> {block.content}
                </div>
              ))}
            </div>
          ) : null}
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