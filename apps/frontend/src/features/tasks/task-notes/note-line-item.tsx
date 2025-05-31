import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
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
import { useDndTreeContext } from "./note-lines-dnd-context";

const generateId = () => Math.random().toString(36).substring(2, 11);

interface NoteLineItemProps {
  line: NoteLine;
  level: number;
  onChange: (id: string, value: string) => void;
  onTypeChange: (id: string, type: NoteLineType) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onDelete: (id: string) => void;
  dragOverlay?: boolean;
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

function isDescendant(lines: NoteLine[], parentId: string | null, id: string): boolean {
  if (!parentId) return false;
  let curr = lines.find(l => l.id === id);
  while (curr) {
    if (curr.parentId === parentId) return true;
    if (!curr.parentId) break;
    curr = lines.find(l => l.id === curr.parentId);
    if (!curr) break;
  }
  return false;
}

function getDescendantIds(lines: NoteLine[], id: string): string[] {
  const children = lines.filter(l => l.parentId === id);
  return children.reduce<string[]>(
    (acc, child) => [...acc, child.id, ...getDescendantIds(lines, child.id)],
    []
  );
}

export const SortableNoteLineItem: React.FC<NoteLineItemProps> = (props) => {
  const { line, level, onChange, onTypeChange, onKeyDown, onDelete, dragOverlay } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, over } = useSortable({ id: line.id });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [inputValue, setInputValue] = useState(line.content);
  const [typeMenuIndex, setTypeMenuIndex] = useState(0);
  const { activeId, lines } = useDndTreeContext();
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  // Скрывать элемент, если он входит в перемещаемую ветку (кроме DragOverlay)
  let hide = false;
  if (!dragOverlay && activeId) {
    if (line.id === activeId) hide = true;
    else {
      const descendantIds = getDescendantIds(lines, activeId);
      if (descendantIds.includes(line.id)) hide = true;
    }
  }
  if (hide) return null;

  // Получаем все строки из props через context или пробрасываем
  // Для простоты используем window (можно заменить на context, если нужно)
  const allLines = (window as any).__NOTE_LINES__ || [];

  // Является ли этот элемент потомком активного dnd
  const isChildOfActive = activeId && isDescendant(allLines, activeId, line.id);
  const isActiveDnd = isDragging || activeId === line.id || isChildOfActive;

  // Цвета для темной/светлой темы через CSS-переменные
  const primaryColor = 'var(--primary, #2563eb)';
  const dropBg = 'var(--dnd-drop-bg, rgba(37,99,235,0.18))';
  const dragBg = 'var(--dnd-drag-bg, rgba(80,80,100,0.18))';
  const overBg = 'var(--dnd-over-bg, rgba(37,99,235,0.22))';

  // Подсветка области дропа
  const isOver = over?.id === line.id && !isDragging;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isActiveDnd ? transition : undefined,
    opacity: isActiveDnd ? 0.5 : 1,
    marginLeft: level * 24,
    background: isOver ? overBg : isActiveDnd ? dragBg : undefined,
    borderRadius: 6,
    position: 'relative' as const,
    minHeight: 36,
    display: 'flex',
    alignItems: 'center',
    zIndex: isDragging ? 10 : 1,
    boxShadow: isActiveDnd ? `0 2px 12px ${primaryColor}22` : undefined,
    marginBottom: 2,
    transitionProperty: isActiveDnd ? 'background, box-shadow, opacity, transform' : undefined,
    transitionDuration: isActiveDnd ? '120ms' : undefined,
  };

  const dragHandleStyle = {
    cursor: "grab",
    padding: "0 8px 0 0",
    fontSize: 22,
    color: isDragging ? "#2563eb" : "#888",
    userSelect: "none" as const,
    display: "flex",
    alignItems: "center"
  };

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

  const handleDivKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Проксируем только нужные клавиши
    if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Tab') {
      // Приводим к типу, ожидаемому onKeyDown
      onKeyDown(e as unknown as React.KeyboardEvent);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (window.getSelection()?.toString()) {
      setMenuPos({ x: e.clientX, y: e.clientY });
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleMenuAction = (action: "bold" | "italic" | "underline") => {
    document.execCommand(action);
    setShowMenu(false);
  };

  useEffect(() => {
    if (!showMenu) return;
    const close = () => setShowMenu(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [showMenu]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      data-line-id={line.id}
      className="group w-full transition-colors duration-100 hover:bg-primary/10 flex flex-row items-center"
    >
      <span
        {...listeners}
        style={dragHandleStyle}
        className="group-hover:opacity-100 opacity-0 transition-opacity duration-100 select-none w-6 flex-shrink-0 flex items-center justify-center mr-2"
      >
        ⠿
      </span>
      <div className="flex-1 flex flex-row items-center gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
              className="mr-2 group-hover:opacity-100 opacity-0 transition-opacity duration-100"
            >
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
        {line.type === "text" ? (
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none min-h-[1.8em] px-1 flex-1"
            spellCheck={true}
            onInput={e => {
              const value = (e.target as HTMLElement).innerHTML;
              setInputValue(value);
              onChange(line.id, value);
            }}
            onKeyDown={handleDivKeyDown}
            onContextMenu={handleContextMenu}
            dangerouslySetInnerHTML={undefined}
          >
            <span dangerouslySetInnerHTML={{ __html: inputValue }} />
            {showMenu && menuPos && ReactDOM.createPortal(
              <div
                className="fixed z-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-md flex gap-1 p-1"
                style={{ left: menuPos.x, top: menuPos.y }}
                onMouseDown={e => e.stopPropagation()}
              >
                <button
                  className="px-2 py-1 rounded hover:bg-primary/20 font-bold"
                  onClick={() => handleMenuAction("bold")}
                  type="button"
                >
                  B
                </button>
                <button
                  className="px-2 py-1 rounded hover:bg-primary/20 italic"
                  onClick={() => handleMenuAction("italic")}
                  type="button"
                >
                  I
                </button>
                <button
                  className="px-2 py-1 rounded hover:bg-primary/20 underline"
                  onClick={() => handleMenuAction("underline")}
                  type="button"
                >
                  U
                </button>
              </div>,
              document.body
            )}
          </div>
        ) : line.type === "heading1" || line.type === "heading2" || line.type === "heading3" || line.type === "list" || line.type === "link" ? (
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
      </div>
    </div>
  );
}; 