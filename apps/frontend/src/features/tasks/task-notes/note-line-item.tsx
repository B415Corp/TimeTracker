import React from "react";
import { NoteLine, NoteLineType } from "./note-line.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface NoteLineItemProps {
  line: NoteLine;
  level: number;
  onChange: (id: string, value: string) => void;
  onTypeChange: (id: string, type: NoteLineType) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const SortableNoteLineItem: React.FC<NoteLineItemProps> = (props) => {
  const { line, level, onChange, onTypeChange, onKeyDown } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: line.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    marginLeft: level * 24,
    gap: 8,
    background: isDragging ? "#f0f0f0" : undefined,
    borderRadius: 4,
    padding: 2,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <span {...listeners} style={{ cursor: "grab", padding: "0 4px" }}>⠿</span>
      <select
        value={line.type}
        onChange={e => onTypeChange(line.id, e.target.value as NoteLineType)}
        style={{ minWidth: 80 }}
      >
        <option value="heading">Заголовок</option>
        <option value="list">Список</option>
        <option value="text">Текст</option>
        <option value="link">Ссылка</option>
        <option value="file">Файл</option>
      </select>
      {line.type === "text" || line.type === "heading" || line.type === "list" ? (
        <input
          type="text"
          value={line.content}
          onChange={e => onChange(line.id, e.target.value)}
          onKeyDown={onKeyDown}
          style={{ flex: 1 }}
          placeholder={line.type === "heading" ? "Заголовок..." : line.type === "list" ? "Пункт списка..." : "Текст..."}
        />
      ) : line.type === "link" ? (
        <input
          type="text"
          value={line.content}
          onChange={e => onChange(line.id, e.target.value)}
          onKeyDown={onKeyDown}
          style={{ flex: 1 }}
          placeholder="URL или текст ссылки..."
        />
      ) : line.type === "file" ? (
        <input type="file" disabled style={{ flex: 1 }} />
      ) : null}
    </div>
  );
}; 