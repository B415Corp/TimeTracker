import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { PaginatedResponse } from "../interfaces/api.interface";
import {
  CreateNotesDTO,
  EditNotesDTO,
  Notes,
  NotesSchema,
} from "../interfaces/notes.interface";
import { validatePaginatedResponse, validateWithSchema } from "@/lib/validator";

export const notesService = createApi({
  reducerPath: "notes-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["notes-pagiated", "notes-id", "task-notes-pagiated", "task-notes-id"],
  endpoints: (builder) => ({
    getNotes: builder.query<PaginatedResponse<Notes>, { page: number }>({
      query: ({ page }) => ({
        url: `notes/me?page=${page || 1}`,
        method: "GET",
      }),
      transformResponse: (response: PaginatedResponse<Notes>) => {
        return validatePaginatedResponse(NotesSchema, response, "getNotes");
      },
      providesTags: ["notes-pagiated"],
    }),
    getNotesById: builder.query<Notes, { note_id: string }>({
      query: ({ note_id }) => ({
        url: `notes/${note_id}`,
        method: "GET",
      }),
      providesTags: ["notes-id"],
      transformResponse: (response: { data: Notes }) => {
        return validateWithSchema<Notes>(
          NotesSchema,
          response.data,
          "getNotesById"
        );
      },
    }),
    createNotes: builder.mutation<Notes, CreateNotesDTO>({
      query: (data) => ({
        url: `notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notes-pagiated"],
    }),
    editNotes: builder.mutation<Notes, { note_id: string } & EditNotesDTO>({
      query: ({ note_id, ...data }) => ({
        url: `notes/${note_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["notes-pagiated", "notes-id"],
    }),
    deleteNotes: builder.mutation<Notes, { id: string }>({
      query: ({ id }) => ({
        url: `notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notes-pagiated"],
    }),
    getTaskNotes: builder.query<PaginatedResponse<Notes>, { task_id: string; page: number }>({
      query: ({ task_id, page }) => ({
        url: `tasks/${task_id}/notes?page=${page || 1}`,
        method: "GET",
      }),
      transformResponse: (response: PaginatedResponse<Notes>) => {
        return validatePaginatedResponse(NotesSchema, response, "getTaskNotes");
      },
      providesTags: ["task-notes-pagiated"],
    }),
    getTaskNoteById: builder.query<Notes, { task_id: string; note_id: string }>({
      query: ({ task_id, note_id }) => ({
        url: `tasks/${task_id}/notes/${note_id}`,
        method: "GET",
      }),
      providesTags: ["task-notes-id"],
      transformResponse: (response: { data: Notes }) => {
        return validateWithSchema<Notes>(NotesSchema, response.data, "getTaskNoteById");
      },
    }),
    createTaskNote: builder.mutation<Notes, { task_id: string } & CreateNotesDTO>({
      query: ({ task_id, ...data }) => ({
        url: `tasks/${task_id}/notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["task-notes-pagiated"],
    }),
    editTaskNote: builder.mutation<Notes, { task_id: string; note_id: string } & EditNotesDTO>({
      query: ({ task_id, note_id, ...data }) => ({
        url: `tasks/${task_id}/notes/${note_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["task-notes-pagiated", "task-notes-id"],
    }),
    deleteTaskNote: builder.mutation<Notes, { task_id: string; note_id: string }>({
      query: ({ task_id, note_id }) => ({
        url: `tasks/${task_id}/notes/${note_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["task-notes-pagiated"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNotesByIdQuery,
  useEditNotesMutation,
  useCreateNotesMutation,
  useDeleteNotesMutation,
  useGetTaskNotesQuery,
  useGetTaskNoteByIdQuery,
  useEditTaskNoteMutation,
  useCreateTaskNoteMutation,
  useDeleteTaskNoteMutation,
} = notesService;
