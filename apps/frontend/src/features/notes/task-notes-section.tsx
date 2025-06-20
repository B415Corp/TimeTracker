import { Button } from "@ui/button";
import { useGetTaskNoteQuery, useUpsertTaskNoteMutation } from "@/shared/api/task-note.service";
import { TiptapEditor } from "@/entities/tiptap/TiptapEditor";
import { useState, useEffect, useRef } from "react";

/**
 * Компонент вкладки "Заметки" внутри детальной страницы задачи
 * Отображает список заметок и позволяет создать новую
 */
export default function TaskNoteSection({ taskId }: { taskId: string }) {
  const { data: note, isFetching } = useGetTaskNoteQuery({ task_id: taskId });
  const [content, setContent] = useState<string>("<p></p>");
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [saveNote] = useUpsertTaskNoteMutation();
  const lastSavedRef = useRef<string>(note?.content || "");
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  // Инициализируем контент только при первой загрузке
  useEffect(() => {
    if (!initialLoaded && note?.content) {
      setContent(note.content);
      setInitialLoaded(true);
    }
  }, [note, initialLoaded]);

  // Авто-сохранение с задержкой 1 сек после изменений
  useEffect(() => {
    if (content === lastSavedRef.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      await saveNote({ task_id: taskId, content });
      lastSavedRef.current = content;
    }, 1000);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [content, taskId, saveNote]);

  return (
    <div className="flex flex-col gap-4">
      {!initialLoaded ? (
        <p>Загрузка...</p>
      ) : (
        <div className="border border-gray-700 rounded-md p-3 min-h-48">
          <TiptapEditor initialContent={content} onChange={setContent} />
        </div>
      )}
      <p className="text-xs text-muted-foreground self-end">Автосохранение…</p>
    </div>
  );
} 