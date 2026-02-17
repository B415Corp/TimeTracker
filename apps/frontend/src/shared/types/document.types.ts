export enum BlockType {
  PARAGRAPH = 'paragraph',
  HEADING_1 = 'heading_1',
  HEADING_2 = 'heading_2',
  HEADING_3 = 'heading_3',
  BULLET_LIST = 'bullet_list',
  NUMBERED_LIST = 'numbered_list',
  CHECKLIST = 'checklist',
  TABLE = 'table',
  IMAGE = 'image',
  FILE = 'file',
  LINK_BOOKMARK = 'link_bookmark',
  LINK_EMBED = 'link_embed',
  CODE = 'code',
  DIVIDER = 'divider',
  CALLOUT = 'callout',
  QUOTE = 'quote',
}

export enum FieldType {
  TEXT = 'text',
  LONG_TEXT = 'long_text',
  NUMBER = 'number',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  URL = 'url',
  EMAIL = 'email',
  PHONE = 'phone',
  USER = 'user',
  RELATION = 'relation',
  TAGS = 'tags',
}

export enum DocumentRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  COMMENTER = 'commenter',
}

export interface Document {
  document_id: string;
  project_id: string;
  parent_document_id?: string;
  title: string;
  icon?: string;
  cover_image?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  creator?: User;
  updater?: User;
  parent?: Document;
  children?: Document[];
  blocks?: DocumentBlock[];
  members?: DocumentMember[];
  customFieldValues?: DocumentFieldValue[];
  comments?: DocumentComment[];
  versions?: DocumentVersion[];
}

export interface DocumentBlock {
  block_id: string;
  document_id: string;
  type: BlockType;
  content: any;
  order: number;
  parent_block_id?: string;
  properties?: any;
  created_at: string;
  updated_at: string;
  parent?: DocumentBlock;
  children?: DocumentBlock[];
  comments?: DocumentComment[];
}

export interface CustomField {
  field_id: string;
  project_id: string;
  name: string;
  type: FieldType;
  config?: any;
  is_required: boolean;
  created_at: string;
}

export interface DocumentFieldValue {
  value_id: string;
  document_id: string;
  field_id: string;
  value: any;
  field?: CustomField;
}

export interface DocumentMember {
  member_id: string;
  document_id: string;
  user_id: string;
  role: DocumentRole;
  assigned_by: string;
  assigned_at: string;
  user?: User;
  assigner?: User;
}

export interface DocumentVersion {
  version_id: string;
  document_id: string;
  updated_by: string;
  updated_at: string;
  change_description?: string;
  user?: User;
}

export interface DocumentComment {
  comment_id: string;
  document_id?: string;
  block_id?: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  parent?: DocumentComment;
  replies?: DocumentComment[];
}

export interface DocumentFile {
  file_id: string;
  document_id: string;
  block_id?: string;
  filename: string;
  path: string;
  mime_type: string;
  size: number;
  uploaded_by: string;
  created_at: string;
  uploader?: User;
}

interface User {
  user_id: string;
  name: string;
  email: string;
  avatar: string;
}
