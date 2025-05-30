import React, { useState, useRef } from "react";
import { NoteLine, NoteLineType } from "./note-line.types";
import { SortableNoteLineItem } from "./note-line-item";
import { NoteLinesDndContext } from "./note-lines-dnd-context";
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
}

// Вспомогательная функция для построения дерева из flat-списка
function buildTree(
  lines: NoteLine[],
  parentId: string | null = null,
  level = 0,
  onChange: (id: string, value: string) => void,
  onTypeChange: (id: string, type: NoteLineType) => void,
  onKeyDown: (e: React.KeyboardEvent, line: NoteLine) => void
): React.ReactNode[] {
  return lines
    .filter(line => line.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map(line => (
      <div key={line.id}>
        <SortableNoteLineItem
          line={line}
          level={level}
          onChange={onChange}
          onTypeChange={onTypeChange}
          onKeyDown={e => onKeyDown(e, line)}
        />
        {buildTree(lines, line.id, level + 1, onChange, onTypeChange, onKeyDown)}
      </div>
    ));
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function getDescendants(lines: NoteLine[], id: string): NoteLine[] {
  const children = lines.filter(l => l.parentId === id);
  return children.reduce<NoteLine[]>(
    (acc, child) => [...acc, child, ...getDescendants(lines, child.id)],
    []
  );
}

function getNestingLevel(lines: NoteLine[], id: string): number {
  let level = 0;
  let curr = lines.find(l => l.id === id);
  while (curr && curr.parentId) {
    level++;
    curr = lines.find(l => l.id === curr.parentId);
  }
  return level;
}

function canNest(lines: NoteLine[], parentId: string | null, draggedId: string, type: NoteLineType): boolean {
  if (!parentId) return true;
  const parent = lines.find(l => l.id === parentId);
  if (!parent) return true;
  // Запретить вложенность "файл в файл"
  if (parent.type === "file" && type === "file") return false;
  // Запретить вложенность в своих потомков (циклы)
  const descendants = getDescendants(lines, draggedId).map(d => d.id);
  if (descendants.includes(parentId)) return false;
  // Ограничение по уровню вложенности
  const parentLevel = getNestingLevel(lines, parentId);
  if (parentLevel >= 9) return false; // 0-based, значит максимум 10
  return true;
}

export const NoteLinesEditor: React.FC<NoteLinesEditorProps> = ({ lines: initialLines }) => {
  const [lines, setLines] = useState<NoteLine[]>(initialLines);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const handleChange = (id: string, value: string) => {
    setLines(lines => lines.map(l => l.id === id ? { ...l, content: value } : l));
  };

  const handleTypeChange = (id: string, type: NoteLineType) => {
    setLines(lines => lines.map(l => l.id === id ? { ...l, type } : l));
  };

  const handleKeyDown = (e: React.KeyboardEvent, line: NoteLine) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Добавить новую строку после текущей
      const newLine: NoteLine = {
        id: generateId(),
        parentId: line.parentId,
        order: line.order + 0.1, // временно, потом пересортируем
        type: "text",
        content: "",
      };
      setLines(lines => {
        const updated = [...lines, newLine].map(l =>
          l.parentId === line.parentId && l.order > line.order ? { ...l, order: l.order + 1 } : l
        );
        return updated;
      });
    } else if (e.key === "Backspace" && line.content === "") {
      e.preventDefault();
      // Удалить строку, если она пустая
      setLines(lines => lines.filter(l => l.id !== line.id));
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      setLines(lines => {
        const idx = lines.findIndex(l => l.id === line.id);
        if (idx > 0) {
          const prev = lines[idx - 1];
          // Сделать текущую строку дочерней предыдущей
          return lines.map(l => l.id === line.id ? { ...l, parentId: prev.id } : l);
        }
        return lines;
      });
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      setLines(lines => {
        const idx = lines.findIndex(l => l.id === line.id);
        if (idx > -1) {
          const curr = lines[idx];
          const parent = lines.find(l => l.id === curr.parentId);
          // Поднять на уровень выше (сделать дочерней родителя родителя)
          return lines.map(l => l.id === line.id ? { ...l, parentId: parent?.parentId ?? null } : l);
        }
        return lines;
      });
    }
  };

  // DND: вложенность и перенос поддерева
  const handleMove = (oldIndex: number, newIndex: number) => {
    setLines(lines => {
      if (draggedId) {
        const dragged = lines.find(l => l.id === draggedId)!;
        const descendants = getDescendants(lines, draggedId);
        const idsToMove = [draggedId, ...descendants.map(d => d.id)];
        let filtered = lines.filter(l => !idsToMove.includes(l.id));
        filtered.splice(newIndex, 0, ...[dragged, ...descendants]);
        return filtered.map((l, idx) => ({ ...l, order: idx }));
      }
      return lines;
    });
    setDraggedId(null);
    setDragOffset(0);
  };

  const handleDragMove = (offsetX: number) => {
    setDragOffset(offsetX);
  };

  // При drop определяем вложенность по dragOffset
  const handleDragEnd = (oldIndex: number, newIndex: number) => {
    setLines(lines => {
      if (draggedId) {
        let newParentId: string | null = null;
        let canNestResult = true;
        const dragged = lines.find(l => l.id === draggedId)!;
        if (dragOffset > 40 && newIndex > 0) {
          const prev = lines[newIndex - 1];
          canNestResult = canNest(lines, prev.id, draggedId, dragged.type);
          if (canNestResult) newParentId = prev.id;
        } else if (dragOffset < -40) {
          const curr = lines.find(l => l.id === draggedId)!;
          const parent = lines.find(l => l.id === curr.parentId);
          canNestResult = canNest(lines, parent?.parentId ?? null, draggedId, dragged.type);
          if (canNestResult) newParentId = parent?.parentId ?? null;
        } else {
          const curr = lines.find(l => l.id === draggedId)!;
          canNestResult = canNest(lines, curr.parentId, draggedId, dragged.type);
          if (canNestResult) newParentId = curr.parentId;
        }
        if (!canNestResult) return lines; // запрещено
        return lines.map(l => l.id === draggedId ? { ...l, parentId: newParentId } : l);
      }
      return lines;
    });
    setDraggedId(null);
    setDragOffset(0);
  };

  // DND: flat-список для SortableContext
  const flatLines = lines.filter(l => l.parentId === null).sort((a, b) => a.order - b.order);

  return (
    <NoteLinesDndContext
      lines={flatLines}
      onMove={(oldIndex, newIndex) => {
        setDraggedId(flatLines[oldIndex]?.id ?? null);
        handleMove(oldIndex, newIndex);
        handleDragEnd(oldIndex, newIndex);
      }}
      onDragMove={handleDragMove}
    >
      {buildTree(lines, null, 0, handleChange, handleTypeChange, handleKeyDown)}
    </NoteLinesDndContext>
  );
}; 