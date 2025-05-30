export type NoteLineType = "heading" | "list" | "text" | "link" | "file" | "todo" | "divider" | "code" | "quote";

export interface NoteLine {
  id: string;
  parentId: string | null;
  order: number;
  type: NoteLineType;
  content: string;
  checked?: boolean; // для todo
  lang?: string; // для code
  // ...доп. поля (например, для ссылок/файлов)
} 