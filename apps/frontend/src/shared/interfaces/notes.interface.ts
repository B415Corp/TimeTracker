import { z } from "zod";

// NotesSchema
export const NotesSchema = z.object({
  notes_id: z.string(),
  text_content: z.union([z.string(), z.array(z.any())]),
  parent_note_id: z.string().nullable().optional(),
  task_id: z.string().nullable().optional(),
  nesting_level: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
  parentNote: z.object({
    notes_id: z.string(),
  }).nullable().optional(),
  childNotes: z.array(z.object({
    notes_id: z.string(),
    nesting_level: z.number(),
  })).optional(),
  task: z.object({
    task_id: z.string(),
  }).nullable().optional(),
});

// CreateNotesDTOSchema
export const CreateNotesDTOSchema = z.object({
  text_content: z.string(),
  parent_note_id: z.string().optional(),
  task_id: z.string().optional(),
  nesting_level: z.number().min(0).max(10).optional(),
});

// EditNotesDTOSchema
export const EditNotesDTOSchema = z.object({
  text_content: z.string().optional(),
  parent_note_id: z.string().optional(),
  task_id: z.string().optional(),
  nesting_level: z.number().min(0).max(10).optional(),
});

export type Notes = z.infer<typeof NotesSchema>;
export type CreateNotesDTO = z.infer<typeof CreateNotesDTOSchema>;
export type EditNotesDTO = z.infer<typeof EditNotesDTOSchema>;
