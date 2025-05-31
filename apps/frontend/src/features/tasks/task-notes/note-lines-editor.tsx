import React from "react";
import { NoteLine, NoteLineType } from "./note-line.types";
import { SortableNoteLineItem } from "./note-line-item";
import { NoteLinesDndContext } from "./note-lines-dnd-context";
import { Plus, Trash2, ClipboardCopy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteLinesDndTreeContext } from "./note-lines-dnd-context";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { arrayMove } from "array-move";

// Простая реализация arrayMove для перестановки элементов
function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const arr = array.slice();
  const val = arr.splice(from, 1)[0];
  arr.splice(to, 0, val);
  return arr;
}

interface NoteLinesEditorProps {
  lines: NoteLine[];
  onChange: (lines: NoteLine[]) => void;
  onSave?: () => void;
}

// Новый buildTree с SortableContext на каждом уровне
function buildTree(
  lines: NoteLine[],
  parentId: string | null = null,
  level = 0,
  onChange: (id: string, value: string) => void,
  onTypeChange: (id: string, type: NoteLineType) => void,
  onKeyDown: (e: React.KeyboardEvent, line: NoteLine) => void,
  onDelete: (id: string) => void
): React.ReactNode {
  const children = lines
    .filter((line) => line.parentId === parentId)
    .sort((a, b) => a.order - b.order);
  return (
    <SortableContext items={children.map(l => l.id)} strategy={verticalListSortingStrategy}>
      {children.map(line => (
        <React.Fragment key={line.id}>
          <SortableNoteLineItem
            line={line}
            level={level}
            onChange={onChange}
            onTypeChange={onTypeChange}
            onKeyDown={(e) => onKeyDown(e, line)}
            onDelete={onDelete}
          />
          {buildTree(lines, line.id, level + 1, onChange, onTypeChange, onKeyDown, onDelete)}
        </React.Fragment>
      ))}
    </SortableContext>
  );
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function getDescendants(lines: NoteLine[], id: string): NoteLine[] {
  const children = lines.filter((l) => l.parentId === id);
  return children.reduce<NoteLine[]>(
    (acc, child) => [...acc, child, ...getDescendants(lines, child.id)],
    []
  );
}

function getNestingLevel(lines: NoteLine[], id: string): number {
  let level = 0;
  let curr = lines.find((l) => l.id === id);
  while (curr && curr.parentId) {
    level++;
    const next = lines.find((l) => l.id === curr!.parentId);
    if (!next) break;
    curr = next;
  }
  return level;
}

function canNest(
  lines: NoteLine[],
  parentId: string | null,
  draggedId: string,
  type: NoteLineType
): boolean {
  if (!parentId) return true;
  const parent = lines.find((l) => l.id === parentId);
  if (!parent) return true;
  // Запретить вложенность "файл в файл"
  if (parent.type === "file" && type === "file") return false;
  // Запретить вложенность в своих потомков (циклы)
  const descendants = getDescendants(lines, draggedId).map((d) => d.id);
  if (descendants.includes(parentId)) return false;
  // Ограничение по уровню вложенности
  const parentLevel = getNestingLevel(lines, parentId);
  if (parentLevel >= 9) return false; // 0-based, значит максимум 10
  return true;
}

// Функция для преобразования lines в Markdown
function linesToMarkdown(lines: NoteLine[], parentId: string | null = null, level = 0): string {
  return lines
    .filter(l => l.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map(l => {
      let prefix = "";
      if (l.type === "heading1") prefix = "# ";
      else if (l.type === "heading2") prefix = "## ";
      else if (l.type === "heading3") prefix = "### ";
      else if (l.type === "list") prefix = "- ";
      else if (l.type === "todo") prefix = l.checked ? "- [x] " : "- [ ] ";
      else if (l.type === "quote") prefix = "> ";
      else if (l.type === "code") prefix = "```\n";
      else prefix = level > 0 ? "  ".repeat(level) + "- " : "";
      let content = l.content || "";
      if (l.type === "code") content = content + "\n```";
      return prefix + content + "\n" + linesToMarkdown(lines, l.id, level + 1);
    })
    .join("");
}

export const NoteLinesEditor: React.FC<NoteLinesEditorProps> = ({
  lines,
  onChange,
  onSave,
}) => {
  // Всегда сортируем по order
  const sortedLines = [...lines].sort((a, b) => a.order - b.order);

  // Состояние для индикации места вставки
  const [dropIndicator, setDropIndicator] = React.useState<{
    show: boolean;
    targetLineId?: string;
    position?: 'before' | 'after';
  }>({ show: false });

  const handleChange = (id: string, value: string) => {
    onChange(
      sortedLines.map((l) => (l.id === id ? { ...l, content: value } : l))
    );
  };

  const handleTypeChange = (id: string, type: NoteLineType) => {
    onChange(sortedLines.map((l) => (l.id === id ? { ...l, type } : l)));
  };

  const handleDelete = (id: string) => {
    // Получаем все потомки удаляемого элемента
    const descendants = getDescendants(sortedLines, id);
    const deleteIds = [id, ...descendants.map(d => d.id)];
    
    // Удаляем элемент и всех его потомков
    onChange(sortedLines.filter((l) => !deleteIds.includes(l.id)));
  };

  const handleKeyDown = (e: React.KeyboardEvent, line: NoteLine) => {
    // Проверяем, если это событие создания новой строки
    if ((e as any).detail?.action === 'createNewLine') {
      const currentLine = (e as any).detail.currentLine;
      const newLineType = (e as any).detail.newLineType;
      
      // Создаем новую строку сразу под текущей
      const newLine: NoteLine = {
        id: generateId(),
        parentId: currentLine.parentId, // Сохраняем тот же уровень вложенности
        order: currentLine.order + 1,
        type: newLineType,
        content: "",
      };
      
      // Сдвигаем все строки после текущей на +1
      const updatedLines = sortedLines.map(l => 
        l.order > currentLine.order ? { ...l, order: l.order + 1 } : l
      );
      
      // Добавляем новую строку
      onChange([...updatedLines, newLine]);
      
      // Устанавливаем фокус на новую строку
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        // Ищем input с data-line-id равным id новой строки
        const targetInput = Array.from(inputs).find(input => 
          (input as HTMLElement).closest('[data-line-id]')?.getAttribute('data-line-id') === newLine.id
        ) as HTMLElement;
        if (targetInput) {
          targetInput.focus();
        } else {
          // Fallback: фокусируемся на следующем input после текущего
          const currentInput = Array.from(inputs).find(input => 
            (input as HTMLElement).closest('[data-line-id]')?.getAttribute('data-line-id') === currentLine.id
          );
          if (currentInput) {
            const currentIndex = Array.from(inputs).indexOf(currentInput);
            const nextInput = inputs[currentIndex + 1] as HTMLElement;
            nextInput?.focus();
          }
        }
      }, 10);
      
      return;
    }
    
    // Остальная логика для обычных клавиш (оставляем как fallback)
    if (e.key === "Enter") {
      e.preventDefault();
      const newLine: NoteLine = {
        id: generateId(),
        parentId: line.parentId,
        order: line.order + 1,
        type: "text",
        content: "",
      };
      
      // Сдвигаем все строки после текущей
      const updatedLines = sortedLines.map(l => 
        l.order > line.order ? { ...l, order: l.order + 1 } : l
      );
      
      onChange([...updatedLines, newLine]);
    } else if (e.key === "Backspace" && line.content === "") {
      e.preventDefault();
      
      // Находим предыдущий элемент для фокуса
      const currentIndex = sortedLines.findIndex(l => l.id === line.id);
      const prevLine = currentIndex > 0 ? sortedLines[currentIndex - 1] : null;
      
      // Удаляем текущий элемент
      const descendants = getDescendants(sortedLines, line.id);
      const deleteIds = [line.id, ...descendants.map(d => d.id)];
      onChange(sortedLines.filter((l) => !deleteIds.includes(l.id)));
      
      // Переводим фокус на предыдущий элемент
      if (prevLine) {
        setTimeout(() => {
          const inputs = document.querySelectorAll('input[type="text"], textarea');
          const targetInput = Array.from(inputs).find(input => 
            (input as HTMLElement).closest('[data-line-id]')?.getAttribute('data-line-id') === prevLine.id
          ) as HTMLElement;
          targetInput?.focus();
        }, 10);
      }
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const idx = sortedLines.findIndex((l) => l.id === line.id);
      if (idx > 0) {
        const prev = sortedLines[idx - 1];
        onChange(
          sortedLines.map((l) =>
            l.id === line.id ? { ...l, parentId: prev.id } : l
          )
        );
        
        // Сохраняем фокус на текущем элементе
        setTimeout(() => {
          const inputs = document.querySelectorAll('input[type="text"], textarea');
          const targetInput = Array.from(inputs).find(input => 
            (input as HTMLElement).closest('[data-line-id]')?.getAttribute('data-line-id') === line.id
          ) as HTMLElement;
          targetInput?.focus();
        }, 10);
      }
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      const idx = sortedLines.findIndex((l) => l.id === line.id);
      if (idx >= 0) {
        const currLine = sortedLines.at(idx);
        if (currLine !== undefined) {
          const parent = sortedLines.find((l) => l.id === currLine.parentId);
          onChange(
            sortedLines.map((l) =>
              l.id === line.id
                ? { ...l, parentId: parent?.parentId ?? null }
                : l
            )
          );
          
          // Сохраняем фокус на текущем элементе
          setTimeout(() => {
            const inputs = document.querySelectorAll('input[type="text"], textarea');
            const targetInput = Array.from(inputs).find(input => 
              (input as HTMLElement).closest('[data-line-id]')?.getAttribute('data-line-id') === line.id
            ) as HTMLElement;
            targetInput?.focus();
          }, 10);
        }
      }
    }
  };

  // Состояние для отслеживания смещения по X (drag вправо/влево)
  const [dragOffsetX, setDragOffsetX] = React.useState(0);
  const DRAG_NEST_INDENT = 32; // px, шаг вложенности
  const [pendingMove, setPendingMove] = React.useState<{
    oldIndex: number;
    newIndex: number;
    newParentId: string | null;
  } | null>(null);

  // Новый обработчик перемещения для вложенного dnd
  const handleMove = (
    sourceId: string,
    newParentId: string | null,
    position: number
  ) => {
    // Копируем массив
    let newLines = [...sortedLines];
    // Находим перемещаемый элемент
    const movedIdx = newLines.findIndex((l) => l.id === sourceId);
    if (movedIdx === -1) return;
    const movedLine = { ...newLines[movedIdx] };
    // Удаляем из старого места
    newLines.splice(movedIdx, 1);
    // Обновляем parentId
    movedLine.parentId = newParentId;
    // Вставляем в новое место среди siblings
    const siblings = newLines.filter((l) => l.parentId === newParentId);
    const siblingIds = siblings.map((l) => l.id);
    // Находим индекс для вставки в общем массиве
    let insertIdx = 0;
    if (siblings.length === 0) {
      // Вставка в конец, ищем последнее совпадение по parentId
      const lastIdx = newLines.reduce((acc, l, idx) => l.parentId === newParentId ? idx : acc, -1);
      insertIdx = lastIdx + 1;
    } else if (position >= siblings.length) {
      // Вставка в конец siblings
      const lastSiblingId = siblingIds[siblingIds.length - 1];
      insertIdx = newLines.findIndex((l) => l.id === lastSiblingId) + 1;
    } else {
      // Вставка перед sibling по позиции
      const targetSiblingId = siblingIds[position];
      insertIdx = newLines.findIndex((l) => l.id === targetSiblingId);
    }
    newLines.splice(insertIdx, 0, movedLine);
    // Пересчитываем order для всех
    newLines = newLines.map((line, idx) => ({ ...line, order: idx }));
    onChange(newLines);
  };

  // DND: включаем ВСЕ строки в SortableContext, а не только корневые
  const allLineIds = sortedLines.map(l => l.id);

  // Показ индикации места вставки
  const handleDragMove = (offsetX: number, offsetY?: number) => {
    setDragOffsetX(offsetX);
    // Не показываем индикатор здесь - он будет управляться в DND контексте
  };

  // Обработка завершения перетаскивания
  const handleMoveWithNesting = (
    oldIndex: number,
    newIndex: number,
    newParentId: string | null = null
  ) => {
    console.log('handleMoveWithNesting:', { oldIndex, newIndex, newParentId, dragOffsetX });
    
    // Скрываем индикатор сразу при начале перемещения
    setDropIndicator({ show: false });
    
    const draggedLine = sortedLines[oldIndex];
    if (!draggedLine) return;
    
    // По умолчанию сохраняем текущий parentId
    let targetParentId = draggedLine.parentId;
    
    // Временно отключаем логику изменения вложенности
    // TODO: DND вложенность: только если есть значительное смещение по X
    /*
    if (Math.abs(dragOffsetX) > DRAG_NEST_INDENT) {
      if (dragOffsetX > DRAG_NEST_INDENT && oldIndex > 0) {
        // Вложить в предыдущий блок
        const prev = sortedLines[oldIndex - 1];
        if (prev && canNest(sortedLines, prev.id, draggedLine.id, draggedLine.type)) {
          targetParentId = prev.id;
        }
      } else if (dragOffsetX < -DRAG_NEST_INDENT) {
        // Поднять на уровень выше
        if (draggedLine.parentId) {
          const parent = sortedLines.find((l) => l.id === draggedLine.parentId);
          targetParentId = parent?.parentId ?? null;
        }
      }
    }
    */
    
    // Если был передан явный newParentId, используем его
    if (newParentId !== null) {
      targetParentId = newParentId;
    }
    
    handleMove(draggedLine.id, targetParentId, newIndex);
    
    // Сбрасываем смещение
    setDragOffsetX(0);
  };

  // Функция для рендеринга с получением DND состояния
  const renderContent = () => buildTree(
    sortedLines,
    null,
    0,
    handleChange,
    handleTypeChange,
    handleKeyDown,
    handleDelete
  );

  // Состояние для копирования
  const [copied, setCopied] = React.useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg sticky top-0 z-10">
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 transition"
          onClick={onSave ? onSave : () => onChange([...lines])}
        >
          <Save size={16} /> Сохранить
        </button>
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 rounded bg-secondary text-gray-900 dark:text-gray-100 hover:bg-secondary/80 transition"
          onClick={() => {
            const md = linesToMarkdown(lines);
            navigator.clipboard.writeText(md);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          <ClipboardCopy size={16} /> {copied ? "Скопировано!" : "Копировать MD"}
        </button>
      </div>
      <NoteLinesDndTreeContext lines={sortedLines} onMove={handleMove}>
        {renderContent()}
      </NoteLinesDndTreeContext>
      
      <div
        style={{ display: "flex", justifyContent: "flex-start", marginTop: 16 }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            const maxOrder =
              sortedLines.length > 0
                ? Math.max(...sortedLines.map((l) => l.order))
                : 0;
            onChange([
              ...sortedLines,
              {
                id: generateId(),
                parentId: null,
                order: maxOrder + 1,
                type: "text",
                content: "",
              },
            ]);
          }}
          className="size-8"
          aria-label="Добавить строку"
        >
          <Plus size={16} />
        </Button>
      </div>
    </>
  );
};
