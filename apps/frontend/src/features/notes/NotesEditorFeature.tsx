import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "lucide-react";
import { Button } from "@ui/button";
import { NoteBlock } from "@/widgets/notes/note-block";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Link as LinkIcon,
  Quote,
  SeparatorHorizontal,
  ImageIcon,
  Strikethrough,
  CodeSquare,
} from "lucide-react";

export interface Block {
  id: string;
  type:
    | "text"
    | "heading1"
    | "heading2"
    | "heading3"
    | "list"
    | "ordered-list"
    | "checkbox"
    | "code"
    | "inline-code"
    | "link"
    | "blockquote"
    | "hr"
    | "image"
    | "strikethrough";
  content: string;
  level?: number;
  parentId?: string;
  checked?: boolean;
  orderNumber?: number;
}

interface Props {
  updateState: (state: Block[]) => void;
  sendToServer: () => void;
}

/**
 * Feature-компонент: редактор заметок с поддержкой блоков, drag-n-drop, markdown, экспорт/импорт
 */
export function NotesEditorFeature({ sendToServer }: Props) {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: uuidv4(),
      type: "heading1",
      content: "Мои заметки",
    },
    {
      id: uuidv4(),
      type: "text",
      content: "Начните писать здесь...",
    },
  ]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [previousBlockId, setPreviousBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{
    id: string;
    position: "before" | "after" | "inside";
  } | null>(null);

  // ... (весь остальной код и функции из note-editor.tsx без изменений)

  // --- Ниже оставить все функции, обработчики, useEffect, UI как есть ---
  // ...
} 