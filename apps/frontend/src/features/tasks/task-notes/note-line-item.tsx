import React, { useRef } from "react";
import { NoteLine, NoteLineType } from "./note-line.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface NoteLineItemProps {
  line: NoteLine;
  level: number;
  onChange: (id: string, value: string) => void;
  onTypeChange: (id: string, type: NoteLineType) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const typeButtons: { type: NoteLineType; label: string }[] = [
  { type: "heading", label: "Заголовок" },
  { type: "list", label: "Список" },
  { type: "text", label: "Текст" },
  { type: "link", label: "Ссылка" },
  { type: "file", label: "Файл" },
];

export const SortableNoteLineItem: React.FC<NoteLineItemProps> = (props) => {
  const { line, level, onChange, onTypeChange, onKeyDown } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: line.id });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <MoreVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {typeButtons.map(btn => (
            <DropdownMenuItem
              key={btn.type}
              onClick={() => onTypeChange(line.id, btn.type)}
              disabled={btn.type === line.type}
            >
              {btn.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
        <>
          <input
            type="text"
            value={line.content}
            onChange={e => onChange(line.id, e.target.value)}
            onKeyDown={onKeyDown}
            style={{ flex: 1 }}
            placeholder="Текст ссылки..."
          />
          <input
            type="url"
            style={{ flex: 1, minWidth: 120 }}
            placeholder="URL..."
            disabled
          />
        </>
      ) : line.type === "file" ? (
        <>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            disabled
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ flex: 1, minWidth: 120, background: "#fafafa", border: "1px solid #ccc", borderRadius: 2 }}
            disabled
          >
            Прикрепить файл (заглушка)
          </button>
        </>
      ) : null}
    </div>
  );
}; 