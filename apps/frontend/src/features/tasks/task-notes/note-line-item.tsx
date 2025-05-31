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

const generateId = () => Math.random().toString(36).substring(2, 11);

interface NoteLineItemProps {
  line: NoteLine;
  level: number;
  onChange: (id: string, value: string) => void;
  onTypeChange: (id: string, type: NoteLineType) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragOverId?: string | null;
  insertPosition?: 'before' | 'after';
}

const typeButtons: { type: NoteLineType; label: string; icon: React.ReactNode }[] = [
  { type: "heading1", label: "Заголовок 1", icon: <Heading size={16} /> },
  { type: "heading2", label: "Заголовок 2", icon: <Heading size={14} /> },
  { type: "heading3", label: "Заголовок 3", icon: <Heading size={12} /> },
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
  const { line, level, onChange, onTypeChange, onKeyDown, onDelete, isDragging, dragOverId, insertPosition } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isCurrentDragging } = useSortable({ id: line.id });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [inputValue, setInputValue] = useState(line.content);
  const [typeMenuIndex, setTypeMenuIndex] = useState(0);

  // Показываем индикатор, когда над этим элементом перетаскивают
  // НО только если это не сам перетаскиваемый элемент
  const showDropIndicator = isDragging && dragOverId === line.id && !isCurrentDragging;

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (e.key === 'Enter') {
        e.preventDefault();
        const createLineEvent = {
          ...e,
          detail: {
            action: 'createNewLine',
            currentLine: line,
            newLineType: line.type
          }
        } as any;
        onKeyDown(createLineEvent);
        return;
      }
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
    opacity: isCurrentDragging ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    marginLeft: level * 24,
    gap: 8,
    background: isCurrentDragging ? "#f0f0f0" : undefined,
    borderRadius: 4,
    padding: 2,
    minHeight: 32,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} data-line-id={line.id}>
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
        <div style={{
          position: "absolute",
          zIndex: 10,
          background: "#f7f7fa",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          boxShadow: "0 4px 24px #0002",
          marginLeft: 40,
          marginTop: 4,
          minWidth: 200,
          color: "#222",
          transition: 'opacity 0.2s cubic-bezier(.4,0,.2,1)',
          fontSize: 15,
          padding: 4,
          animation: 'fadeIn 0.18s',
        }}>
          {typeButtons.map((btn, idx) => (
            <div
              key={btn.type}
              style={{
                padding: '8px 12px',
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                background: idx === typeMenuIndex ? "#e0e7ff" : undefined,
                borderRadius: 6,
                fontWeight: idx === typeMenuIndex ? 600 : 400,
                color: idx === typeMenuIndex ? "#1e293b" : undefined,
                transition: 'background 0.15s',
              }}
              onClick={() => handleTypeSelect(btn.type)}
              onMouseEnter={() => setTypeMenuIndex(idx)}
            >
              <span style={{ marginRight: 10 }}>{btn.icon}</span> {btn.label}
            </div>
          ))}
        </div>
      )}
      {line.type === "text" || line.type === "heading1" || line.type === "heading2" || line.type === "heading3" || line.type === "list" || line.type === "link" ? (
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          {line.type === "list" && <span style={{ marginRight: 8, color: "#666" }}>•</span>}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ 
              flex: 1, 
              fontWeight: line.type === "heading1" ? 700 : line.type === "heading2" ? 600 : line.type === "heading3" ? 500 : undefined,
              fontSize: line.type === "heading1" ? "1.5em" : line.type === "heading2" ? "1.25em" : line.type === "heading3" ? "1.1em" : undefined
            }}
            placeholder={
              line.type === "heading1" ? "Заголовок 1..." : 
              line.type === "heading2" ? "Заголовок 2..." : 
              line.type === "heading3" ? "Заголовок 3..." : 
              line.type === "list" ? "Пункт списка..." : 
              line.type === "link" ? "Ссылка..." : "Текст..."
            }
          />
        </div>
      ) : line.type === "todo" ? (
        <>
          <input 
            type="checkbox" 
            checked={!!line.checked} 
            onChange={(e) => {
              const updatedLine = { ...line, checked: e.target.checked };
              onChange(line.id, updatedLine.content || "");
              onTypeChange(line.id, line.type);
            }} 
            style={{ marginRight: 8 }} 
          />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, textDecoration: line.checked ? "line-through" : "none", opacity: line.checked ? 0.6 : 1 }}
            placeholder="Задача..."
          />
        </>
      ) : line.type === "divider" ? (
        <hr style={{ flex: 1, border: 0, borderTop: "1.5px solid #bbb", margin: "8px 0" }} />
      ) : line.type === "code" ? (
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, fontFamily: "monospace", background: "#f7f7f7", borderRadius: 4, minHeight: 32, padding: 4 }}
          placeholder="Код..."
        />
      ) : line.type === "quote" ? (
        <div style={{ flex: 1, borderLeft: "3px solid #bbb", paddingLeft: 12, color: "#666", fontStyle: "italic", background: "#fafafa" }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
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
      
      {/* Простой индикатор места вставки */}
      {showDropIndicator && (
        <div
          style={{
            position: "absolute",
            top: insertPosition === 'before' ? -2 : undefined,
            bottom: insertPosition === 'after' ? -2 : undefined,
            left: 0,
            right: 0,
            height: 3,
            background: "#2563eb",
            borderRadius: 2,
            boxShadow: "0 0 6px rgba(37, 99, 235, 0.6)",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}; 