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
import { z } from "zod";

export const notesService = createApi({
  reducerPath: "notes-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["notes-pagiated", "notes-id", "notes-task", "notes-hierarchy"],
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
    getNotesByTask: builder.query<Notes[], { task_id: string }>({
      query: ({ task_id }) => ({
        url: `notes/task/${task_id}`,
        method: "GET",
      }),
      providesTags: ["notes-task"],
      transformResponse: (response: { data: Notes[] }) => {
        return validateWithSchema<Notes[]>(
          z.array(NotesSchema),
          response.data,
          "getNotesByTask"
        );
      },
    }),
    getNoteHierarchy: builder.query<Notes, { note_id: string }>({
      query: ({ note_id }) => ({
        url: `notes/${note_id}/hierarchy`,
        method: "GET",
      }),
      providesTags: ["notes-hierarchy"],
      transformResponse: (response: { data: Notes }) => {
        return validateWithSchema<Notes>(
          NotesSchema,
          response.data,
          "getNoteHierarchy"
        );
      },
    }),
    createNotes: builder.mutation<Notes, CreateNotesDTO>({
      query: (data) => ({
        url: `notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notes-pagiated", "notes-task", "notes-hierarchy"],
    }),
    editNotes: builder.mutation<Notes, { note_id: string } & EditNotesDTO>({
      query: ({ note_id, ...data }) => ({
        url: `notes/${note_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["notes-pagiated", "notes-id", "notes-task", "notes-hierarchy"],
    }),
    deleteNotes: builder.mutation<Notes, { id: string }>({
      query: ({ id }) => ({
        url: `notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notes-pagiated", "notes-task", "notes-hierarchy"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNotesByIdQuery,
  useGetNotesByTaskQuery,
  useGetNoteHierarchyQuery,
  useEditNotesMutation,
  useCreateNotesMutation,
  useDeleteNotesMutation,
} = notesService;
