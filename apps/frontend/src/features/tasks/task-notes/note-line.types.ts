export type NoteLineType = "heading1" | "heading2" | "heading3" | "list" | "text" | "link" | "file" | "todo" | "divider" | "code" | "quote";

export interface NoteLine {
  id: string;
  parentId: string | null;
  order: number;
  type: NoteLineType;
  content: string;
  checked?: boolean; // Для todo-элементов
  lang?: string; // для code
  // ...доп. поля (например, для ссылок/файлов)
} 