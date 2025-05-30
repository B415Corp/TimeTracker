import React, { useRef } from "react";
import { NoteLine, NoteLineType } from "./note-line.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Heading, List, AlignLeft, Link as LinkIcon, Paperclip, Trash2 } from "lucide-react";

interface NoteLineItemProps {
  line: NoteLine;
  level: number;
  onChange: (id: string, value: string) => void;
  onTypeChange: (id: string, type: NoteLineType) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onDelete: (id: string) => void;
}

const typeButtons: { type: NoteLineType; label: string; icon: React.ReactNode }[] = [
  { type: "heading", label: "Заголовок", icon: <Heading size={16} /> },
  { type: "list", label: "Список", icon: <List size={16} /> },
  { type: "text", label: "Текст", icon: <AlignLeft size={16} /> },
  { type: "link", label: "Ссылка", icon: <LinkIcon size={16} /> },
  { type: "file", label: "Файл", icon: <Paperclip size={16} /> },
];

function getTypeIcon(type: NoteLineType) {
  return typeButtons.find(btn => btn.type === type)?.icon ?? <AlignLeft size={16} />;
}

export const SortableNoteLineItem: React.FC<NoteLineItemProps> = (props) => {
  const { line, level, onChange, onTypeChange, onKeyDown, onDelete } = props;
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
            {getTypeIcon(line.type)}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {typeButtons.map(btn => (
            <DropdownMenuItem
              key={btn.type}
              onClick={() => onTypeChange(line.id, btn.type)}
              disabled={btn.type === line.type}
            >
              <span style={{ marginRight: 8 }}>{btn.icon}</span>
              {btn.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDelete(line.id)} className="text-destructive focus:text-destructive">
            <Trash2 size={16} style={{ marginRight: 8 }} /> Удалить
          </DropdownMenuItem>
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