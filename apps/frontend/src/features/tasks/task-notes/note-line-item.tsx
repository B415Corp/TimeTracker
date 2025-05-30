import React from "react";
import { NoteLine, NoteLineType } from "./note-line.types";

interface NoteLineItemProps {
  line: NoteLine;
  level: number;
  onChange: (id: string, value: string) => void;
  onTypeChange: (id: string, type: NoteLineType) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const NoteLineItem: React.FC<NoteLineItemProps> = ({ line, level, onChange, onTypeChange, onKeyDown }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: level * 24, gap: 8 }}>
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