export type NoteLineType = "heading" | "list" | "text" | "link" | "file";

export interface NoteLine {
  id: string;
  parentId: string | null;
  order: number;
  type: NoteLineType;
  content: string;
  // ...доп. поля (например, для ссылок/файлов)
} 