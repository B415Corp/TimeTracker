import React, { useState } from "react";
import { NoteLine, NoteLineType } from "./note-line.types";
import { NoteLineItem } from "./note-line-item";

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
        <NoteLineItem
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

export const NoteLinesEditor: React.FC<NoteLinesEditorProps> = ({ lines: initialLines }) => {
  const [lines, setLines] = useState<NoteLine[]>(initialLines);

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
    }
  };

  // Пересортировка order для корректного отображения
  const normalizedLines = lines.map((l, idx) => ({ ...l, order: idx }));

  return (
    <div>
      {buildTree(normalizedLines, null, 0, handleChange, handleTypeChange, handleKeyDown)}
    </div>
  );
}; 