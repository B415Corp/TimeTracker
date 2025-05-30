import React, { useRef, useState } from "react";
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
import { Heading, List, AlignLeft, Link as LinkIcon, Paperclip, Trash2, CheckSquare, Minus, Code2, Quote } from "lucide-react";

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
  { type: "todo", label: "Todo", icon: <CheckSquare size={16} /> },
  { type: "divider", label: "Разделитель", icon: <Minus size={16} /> },
  { type: "code", label: "Код", icon: <Code2 size={16} /> },
  { type: "quote", label: "Цитата", icon: <Quote size={16} /> },
];

function getTypeIcon(type: NoteLineType) {
  return typeButtons.find(btn => btn.type === type)?.icon ?? <AlignLeft size={16} />;
}

export const SortableNoteLineItem: React.FC<NoteLineItemProps> = (props) => {
  const { line, level, onChange, onTypeChange, onKeyDown, onDelete } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: line.id });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [inputValue, setInputValue] = useState(line.content);
  const [typeMenuIndex, setTypeMenuIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.startsWith("/")) {
      setShowTypeMenu(true);
    } else {
      setShowTypeMenu(false);
      onChange(line.id, value);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (showTypeMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setTypeMenuIndex((prev) => (prev + 1) % typeButtons.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setTypeMenuIndex((prev) => (prev - 1 + typeButtons.length) % typeButtons.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleTypeSelect(typeButtons[typeMenuIndex].type);
      } else if (e.key === "Escape") {
        setShowTypeMenu(false);
      }
    } else {
      onKeyDown(e);
    }
  };

  const handleTypeSelect = (type: NoteLineType) => {
    setShowTypeMenu(false);
    setTypeMenuIndex(0);
    onTypeChange(line.id, type);
    if (inputValue.startsWith("/")) {
      const clean = inputValue.replace(/^\/+/, "");
      onChange(line.id, clean);
      setInputValue(clean);
    }
  };

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
    minHeight: 32,
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
      {showTypeMenu && (
        <div style={{ position: "absolute", zIndex: 10, background: "white", border: "1px solid #eee", borderRadius: 6, boxShadow: "0 2px 8px #0001", marginLeft: 40, marginTop: 4, minWidth: 180, transition: 'opacity 0.15s' }}>
          {typeButtons.map((btn, idx) => (
            <div
              key={btn.type}
              style={{ padding: 6, cursor: "pointer", display: "flex", alignItems: "center", background: idx === typeMenuIndex ? "#f0f4ff" : undefined, borderRadius: 4, transition: 'background 0.15s' }}
              onClick={() => handleTypeSelect(btn.type)}
              onMouseEnter={() => setTypeMenuIndex(idx)}
            >
              <span style={{ marginRight: 8 }}>{btn.icon}</span> {btn.label}
            </div>
          ))}
        </div>
      )}
      {line.type === "text" || line.type === "heading" || line.type === "list" || line.type === "link" ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          style={{ flex: 1, fontWeight: line.type === "heading" ? 600 : undefined }}
          placeholder={line.type === "heading" ? "Заголовок..." : line.type === "list" ? "Пункт списка..." : line.type === "link" ? "Ссылка..." : "Текст..."}
        />
      ) : line.type === "todo" ? (
        <>
          <input type="checkbox" checked={!!line.checked} onChange={() => onChange(line.id, line.content)} style={{ marginRight: 8 }} />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            style={{ flex: 1 }}
            placeholder="Задача..."
          />
        </>
      ) : line.type === "divider" ? (
        <hr style={{ flex: 1, border: 0, borderTop: "1.5px solid #bbb", margin: "8px 0" }} />
      ) : line.type === "code" ? (
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          style={{ flex: 1, fontFamily: "monospace", background: "#f7f7f7", borderRadius: 4, minHeight: 32, padding: 4 }}
          placeholder="Код..."
        />
      ) : line.type === "quote" ? (
        <div style={{ flex: 1, borderLeft: "3px solid #bbb", paddingLeft: 12, color: "#666", fontStyle: "italic", background: "#fafafa" }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            style={{ width: "100%", background: "transparent", border: "none", outline: "none" }}
            placeholder="Цитата..."
          />
        </div>
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