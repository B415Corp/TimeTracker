import React from "react";
import { NoteLine, NoteLineType } from "./note-line.types";
import { SortableNoteLineItem } from "./note-line-item";
import { NoteLinesDndContext } from "./note-lines-dnd-context";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

// Вспомогательная функция для построения дерева из flat-списка
function buildTree(
  lines: NoteLine[],
  parentId: string | null = null,
  level = 0,
  onChange: (id: string, value: string) => void,
  onTypeChange: (id: string, type: NoteLineType) => void,
  onKeyDown: (e: React.KeyboardEvent, line: NoteLine) => void,
  onDelete: (id: string) => void
): React.ReactNode[] {
  return lines
    .filter((line) => line.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((line) => (
      <div key={line.id}>
        <SortableNoteLineItem
          line={line}
          level={level}
          onChange={onChange}
          onTypeChange={onTypeChange}
          onKeyDown={(e) => onKeyDown(e, line)}
          onDelete={onDelete}
        />
        {buildTree(
          lines,
          line.id,
          level + 1,
          onChange,
          onTypeChange,
          onKeyDown,
          onDelete
        )}
      </div>
    ));
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
    const next = lines.find((l) => l.id === curr.parentId);
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

export const NoteLinesEditor: React.FC<NoteLinesEditorProps> = ({
  lines,
  onChange,
}) => {
  // Всегда сортируем по order
  const sortedLines = [...lines].sort((a, b) => a.order - b.order);

  const handleChange = (id: string, value: string) => {
    onChange(
      sortedLines.map((l) => (l.id === id ? { ...l, content: value } : l))
    );
  };

  const handleTypeChange = (id: string, type: NoteLineType) => {
    onChange(sortedLines.map((l) => (l.id === id ? { ...l, type } : l)));
  };

  const handleDelete = (id: string) => {
    onChange(sortedLines.filter((l) => l.id !== id && l.parentId !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, line: NoteLine) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const maxOrder =
        sortedLines.length > 0
          ? Math.max(...sortedLines.map((l) => l.order))
          : 0;
      const newLine: NoteLine = {
        id: generateId(),
        parentId: line.parentId,
        order: maxOrder + 1,
        type: "text",
        content: "",
      };
      const updated = [...sortedLines, newLine];
      onChange(updated);
    } else if (e.key === "Backspace" && line.content === "") {
      e.preventDefault();
      onChange(
        sortedLines.filter((l) => l.id !== line.id && l.parentId !== line.id)
      );
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
  const [dragOverDelete, setDragOverDelete] = React.useState(false);

  // Универсальное перемещение строки (и поддерева) с обновлением parentId и order
  const handleMove = (
    oldIndex: number,
    newIndex: number,
    newParentId: string | null = null
  ) => {
    const flat = sortedLines.filter((l) => l.parentId === newParentId);
    const movedFlat = arrayMove(flat, oldIndex, newIndex);
    let updated: NoteLine[] = sortedLines.map((l) => {
      const idx = movedFlat.findIndex((f) => f.id === l.id);
      if (l.parentId === newParentId && idx !== -1) {
        return { ...l, order: idx, parentId: newParentId };
      }
      return l;
    });
    onChange(updated);
  };

  // DND: flat-список для SortableContext
  const flatLines = sortedLines.filter((l) => l.parentId === null);

  // Drag-to-delete: область для удаления
  const handleDragMove = (offsetX: number, offsetY?: number) => {
    setDragOffsetX(offsetX);
    // Если offsetY достаточно большой (перетаскивание вниз) — показываем область удаления
    if (typeof offsetY === "number" && offsetY > 80) {
      setDragOverDelete(true);
    } else {
      setDragOverDelete(false);
    }
  };

  // Drag-to-delete: удаление при отпускании над областью
  const handleMoveWithDelete = (
    oldIndex: number,
    newIndex: number,
    newParentId: string | null = null
  ) => {
    if (dragOverDelete && flatLines[oldIndex]) {
      handleDelete(flatLines[oldIndex].id);
      setDragOverDelete(false);
      return;
    }
    // DND вложенность: вправо — вложить, влево — поднять
    let targetParentId = newParentId;
    if (dragOffsetX > DRAG_NEST_INDENT && oldIndex > 0) {
      // Вложить в предыдущий блок
      const prev = flatLines[oldIndex - 1];
      if (
        canNest(
          sortedLines,
          prev.id,
          flatLines[oldIndex].id,
          flatLines[oldIndex].type
        )
      ) {
        targetParentId = prev.id;
      }
    } else if (dragOffsetX < -DRAG_NEST_INDENT) {
      // Поднять на уровень выше
      const curr = flatLines[oldIndex];
      if (curr && curr.parentId) {
        const parent = sortedLines.find((l) => l.id === curr.parentId);
        targetParentId = parent?.parentId ?? null;
      }
    }
    handleMove(oldIndex, newIndex, targetParentId);
  };

  return (
    <>
      <NoteLinesDndContext
        lines={flatLines}
        onMove={handleMoveWithDelete}
        onDragMove={handleDragMove}
      >
        {buildTree(
          sortedLines,
          null,
          0,
          handleChange,
          handleTypeChange,
          handleKeyDown,
          handleDelete
        )}
      </NoteLinesDndContext>
      {dragOverDelete && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            height: 80,
            background: "#ffeaea",
            color: "#d32f2f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 18,
            zIndex: 1000,
            borderTop: "2px solid #d32f2f",
          }}
        >
          <Trash2 size={28} style={{ marginRight: 12 }} /> Перетащите сюда для
          удаления
        </div>
      )}
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
